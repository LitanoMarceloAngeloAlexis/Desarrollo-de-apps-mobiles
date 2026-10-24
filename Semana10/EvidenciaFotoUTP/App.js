import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "@evidencia_fotos_utp_v1";
const { width } = Dimensions.get("window");

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    loadSavedGallery();
  }, []);

  const loadSavedGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGallery(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Error al cargar galería guardada:", e);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.textLoading}>Comprobando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={80} color="#ff5252" />
        <Text style={styles.permissionTitle}>Permiso Requerido</Text>
        <Text style={styles.permissionText}>
          EvidenciaFoto UTP necesita acceder a la cámara para registrar evidencias fotográficas de entregas o inspecciones.
        </Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={requestPermission}>
          <Text style={styles.buttonText}>Otorgar Permiso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);

    try {
      const result = await cameraRef.current.takePictureAsync({
        skipProcessing: false,
      });

      if (result?.uri) {
        setPhoto(result.uri);
        setDescription("");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la fotografía.");
    } finally {
      setBusy(false);
    }
  };

  const saveEvidencePermanently = async () => {
    if (!photo) return;
    try {
      setBusy(true);
      
      const filename = photo.split("/").pop() || `photo_${Date.now()}.jpg`;
      const newPath = `${FileSystem.documentDirectory}${filename}`;

      console.log("Guardando desde:", photo);
      console.log("Guardando hacia:", newPath);

      await FileSystem.copyAsync({
        from: photo,
        to: newPath,
      });

      const newEntry = {
        id: Date.now().toString(),
        uri: newPath,
        description: description.trim() || "Sin descripción",
        date: new Date().toLocaleString(),
      };

      const updatedGallery = [newEntry, ...gallery];
      setGallery(updatedGallery);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGallery));

      Alert.alert("Éxito", "Evidencia guardada permanentemente en el dispositivo.");
      setPhoto(null);
      setDescription("");
    } catch (error) {
      console.log("ERROR DETALLADO AL GUARDAR:", error);
      Alert.alert("Error", `No se pudo guardar: ${error.message || error}`);
    } finally {
      setBusy(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  return (
    <SafeAreaView style={styles.container}>
      {photo ? (
        <ScrollView contentContainerStyle={styles.reviewContainer}>
          <Text style={styles.headerTitle}>Revisión de Evidencia</Text>
          
          <Image source={{ uri: photo }} style={styles.previewImage} resizeMode="cover" />

          <View style={styles.formContainer}>
            <Text style={styles.label}>Descripción de la actividad / entrega:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Entrega conforme en almacén central..."
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity 
              style={[styles.buttonPrimary, { backgroundColor: "#2e7d32" }]} 
              onPress={saveEvidencePermanently}
              disabled={busy}
            >
              <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Guardar Evidencia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonSecondary, { marginTop: 10 }]} 
              onPress={() => setPhoto(null)}
              disabled={busy}
            >
              <Ionicons name="refresh-outline" size={20} color="#ff5252" style={{ marginRight: 8 }} />
              <Text style={styles.buttonSecondaryText}>Tomar otra foto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            flash={flash}
            ref={cameraRef}
          >
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                <Ionicons
                  name={flash === "on" ? "flash" : "flash-off"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.appTitle}>EvidenciaFoto UTP</Text>
              <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar}>
              <View style={styles.miniGalleryContainer}>
                {gallery.slice(0, 3).map((item) => (
                  <Image key={item.id} source={{ uri: item.uri }} style={styles.miniThumbnail} />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.captureButton, busy && { opacity: 0.5 }]}
                onPress={takePhoto}
                disabled={busy}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <View style={{ width: 60 }} />
            </View>
          </CameraView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 24,
  },
  textLoading: {
    color: "#fff",
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    color: "#aaa",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
  },
  miniGalleryContainer: {
    flexDirection: "row",
    gap: 6,
  },
  miniThumbnail: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  reviewContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#121212",
    flexGrow: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  previewImage: {
    width: width - 40,
    height: (width - 40) * 1.25,
    borderRadius: 12,
    backgroundColor: "#222",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#0066cc",
    flexDirection: "row",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff5252",
    flexDirection: "row",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#ff5252",
    fontSize: 16,
    fontWeight: "bold",
  },
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Button } from 'type-react'; // Ajustado para React Native puro:
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionCard from './components/PermissionCard';

export default function App() {
  const [cameraStatus, setCameraStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    loadSavedPermissions();
  }, []);

  const loadSavedPermissions = async () => {
    try {
      const savedCamera = await AsyncStorage.getItem('@camera_permission');
      const savedLocation = await AsyncStorage.getItem('@location_permission');
      if (savedCamera) setCameraStatus(savedCamera);
      if (savedLocation) setLocationStatus(savedLocation);
    } catch (e) {
      console.error('Error al cargar permisos guardados', e);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraStatus(status);
    await AsyncStorage.setItem('@camera_permission', status);
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Necesitamos acceso a la cámara para que disfrutes de todas las funciones.'
      );
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status);
    await AsyncStorage.setItem('@location_permission', status);

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocationData(location.coords);
    } else {
      Alert.alert(
        'Permiso denegado',
        'Sin tu ubicación no podemos mostrar mapas o rutas cercanas.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <Text style={styles.headerTitle}>PermissionsDemo 🛡️</Text>
        <Text style={styles.subtitle}>Gestión profesional de permisos y privacidad</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permisos del Dispositivo</Text>
          
          <PermissionCard 
            title="Cámara" 
            icon="📷" 
            status={cameraStatus} 
            onRequest={requestCameraPermission} 
          />

          <PermissionCard 
            title="Ubicación GPS" 
            icon="📍" 
            status={locationStatus} 
            onRequest={requestLocationPermission} 
          />
        </View>

        {locationStatus === 'granted' && locationData && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📍 Coordenadas Actuales:</Text>
            <Text>Latitud: {locationData.latitude.toFixed(4)}</Text>
            <Text>Longitud: {locationData.longitude.toFixed(4)}</Text>
          </View>
        )}

        {cameraStatus === 'granted' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📷 Cámara Lista</Text>
            <Text>El sistema está preparado para capturar fotos o videos.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scroll: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3640',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#718093',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f3640',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2f3640',
  },
});
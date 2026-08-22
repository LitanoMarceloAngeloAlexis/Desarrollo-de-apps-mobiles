import { View, Text, Image, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.titulo}>Bienvenido a mi app</Text>
          
          <Text style={styles.subtitulo}>Laboratorio número 2</Text>

          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW5L112KrPLLdFYmK7NyRKyIx5VYuU4suEwfcPy0s1OPKffpuRnd84t1Qj&s=10" }}
            style={styles.imagen}
          />

          <Text style={styles.descripcion}>
            Esta es una interfaz construida con View, Text e imagen en React Native.
          </Text>
        </View>

        <View style={styles.secondaryContainer}>
          <Text style={styles.secondaryText}>Segunda seccion usando otro view</Text>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXk7Yoci0ZfulnTPyyFs7XhiOr6EESuBuutz0u914IlA&s=10" }}
            style={styles.imagen}
          />
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footer}>Seccion del footer</Text>
        <Text style={styles.footer}>© 2026 - Todos los derechos reservados del Laboratorio jajajaj</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8ff",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardContainer: {
    borderWidth: 2,
    borderColor: "#1f3c88",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    width: "100%",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: "#5c6bc0",
    marginBottom: 15,
  },
  imagen: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  descripcion: {
    fontSize: 14,
    color: "#455a64",
    textAlign: "center",
  },
  secondaryContainer: {
    padding: 15,
    backgroundColor: "#e8eaf6",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryText: {
    fontSize: 20,
    marginBottom: 5,
    color: "#3f51b5",
    fontWeight: "600",
  },
  footerContainer: {
    width: "100%",
    backgroundColor: "#f4f2f2",
    alignItems: "center",
    paddingVertical: 10,
  },
  footer: {
    fontSize: 12,
    color: "#9e9e9e",
    textAlign: "center",
  },
});
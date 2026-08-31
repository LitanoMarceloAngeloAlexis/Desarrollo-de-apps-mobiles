import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  const manejarRegistro = () => {
    if (nombre.trim() === '') {
      setMensaje('Por favor, ingrese su nombre');
      setEsError(true);
      return;
    }
    
    setMensaje(`Hola, ${nombre}. Registro correcto.`);
    setEsError(false);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setMensaje('');
    setEsError(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro Básico</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      <View style={styles.contenedorBoton}>
        <Button title="Enviar" onPress={manejarRegistro} color="#007AFF" />
      </View>

      {mensaje !== '' && (
        <Text style={[styles.resultado, esError ? styles.textoError : styles.textoExito]}>
          {mensaje}
        </Text>
      )}

      <TouchableOpacity style={styles.botonSecundario} onPress={limpiarFormulario}>
        <Text style={styles.textoBotonSecundario}>Limpiar Formulario</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  contenedorBoton: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultado: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  textoError: {
    color: '#D9534F',
  },
  textoExito: {
    color: '#5CB85C',
  },
  botonSecundario: {
    backgroundColor: '#bbe3ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#004080',
    fontSize: 16,
    fontWeight: '600',
  },
});
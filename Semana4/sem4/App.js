import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const manejarRegistro = () => {
    if (nombre.trim() === '') {
      setMensaje('Por favor, ingrese su nombre.');
      setEsError(true);
      return;
    }
    
    if (edad.trim() === '') {
      setMensaje('Por favor, ingrese su edad.');
      setEsError(true);
      return;
    }

    if (isNaN(edad) || Number(edad) <= 0) {
      setMensaje('La edad debe ser un número válido mayor a 0.');
      setEsError(true);
      return;
    }
    
    setMensaje(`¡Hola, ${nombre}! Tienes ${edad} años. Registro correcto`);
    setEsError(false);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setEdad('');
    setMensaje('');
    setEsError(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro Avanzado</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingrese su edad"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />

      <View style={[styles.contenedorBoton, enviando && styles.botonPresionado]}>
        <Button 
          title="Registrarse" 
          onPress={manejarRegistro} 
          onPressIn={() => setEnviando(true)}   
          onPressOut={() => setEnviando(false)}  
          color={enviando ? '#FF5733' : '#007AFF'} 
        />
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
  botonPresionado: {
    opacity: 0.8,
  },
  resultado: {
    marginTop: 15,
    fontSize: 15,
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
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#004080',
    fontSize: 16,
    fontWeight: '600',
  },
});
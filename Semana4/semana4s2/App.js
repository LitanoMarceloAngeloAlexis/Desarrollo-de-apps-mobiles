import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getPasswordStrength, validateEmail, validateName, validatePassword, validatePhone } from './rules/validator';

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    
    let error = '';
    if (field === 'name') error = validateName(value);
    if (field === 'email') error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    if (field === 'confirmPassword') error = value !== form.password ? 'Las contraseñas no coinciden.' : '';
    if (field === 'phone') error = validatePhone(value);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const confirmErr = form.password !== form.confirmPassword ? 'Las contraseñas no coinciden.' : '';
    const phoneErr = validatePhone(form.phone);

    if (nameErr || emailErr || passErr || confirmErr || phoneErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmErr, phone: phoneErr });
      return;
    }

    Alert.alert('Éxito', 'Registro exitoso');
  };

  const strength = getPasswordStrength(form.password);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(val) => handleChange('name', val)} placeholder="Tu nombre" />
      {errors.name ? <Text style={styles.error}>{errors.name} </Text> : <Text style={styles.valid}>Valido</Text>}

      <Text style={styles.label}>Correo</Text>
      <TextInput style={styles.input} value={form.email} onChangeText={(val) => handleChange('email', val)} placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" />
      {errors.email ? <Text style={styles.error}>{errors.email} </Text> : <Text style={styles.valid}>Valido</Text>}

      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={styles.input} value={form.password} onChangeText={(val) => handleChange('password', val)} placeholder="********" secureTextEntry />
      {form.password ? <Text style={styles.strength}>Fortaleza: {strength}</Text> : null}
      {errors.password ? <Text style={styles.error}>{errors.password} </Text> : <Text style={styles.valid}>Valido</Text>}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput style={styles.input} value={form.confirmPassword} onChangeText={(val) => handleChange('confirmPassword', val)} placeholder="********" secureTextEntry />
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword} </Text> : <Text style={styles.valid}>Valido</Text>}

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={form.phone} onChangeText={(val) => handleChange('phone', val)} placeholder="3001234567" keyboardType="phone-pad" />
      {errors.phone ? <Text style={styles.error}>{errors.phone} </Text> : <Text style={styles.valid}>Valido</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 25, 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    flexGrow: 1 
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
  },

  label: { fontWeight: '600', 
    marginTop: 12, 
    color: '#444' 
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginTop: 5, 
    backgroundColor: '#f9f9f9' 
  },

  error: { color: 'red', 
    fontSize: 12, 
    marginTop: 4 
  },

  valid: { fontSize: 12, 
    marginTop: 2, 
    alignSelf: 'flex-end' , 
    color: '#0d5400'
  },

  strength: { fontSize: 12, 
    marginTop: 4, 
    fontStyle: 'italic', 
    color: '#666' 
  },

  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 25, 
    alignItems: 'center'
  },

  buttonText: { color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
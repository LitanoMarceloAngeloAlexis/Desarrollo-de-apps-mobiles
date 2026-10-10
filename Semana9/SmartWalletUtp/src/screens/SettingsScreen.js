import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default function SettingsScreen({ budget, onUpdateBudget }) {
  const [newBudget, setNewBudget] = useState(budget.toString());

  const handleSave = () => {
    const val = parseFloat(newBudget);
    if (isNaN(val) || val < 0) {
      Alert.alert('Error', 'Ingrese un presupuesto válido.');
      return;
    }
    onUpdateBudget(val);
    Alert.alert('Éxito', 'Presupuesto actualizado correctamente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Presupuesto Mensual:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={newBudget}
          onChangeText={setNewBudget}
        />
        <Button title="Guardar Presupuesto" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2f3640',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2f3640',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
});
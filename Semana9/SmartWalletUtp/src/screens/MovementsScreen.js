import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import MovementRow from '../components/MovementRow';

export default function MovementsScreen({ movements, onAddMovement, onDeleteMovement }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('General');
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número mayor que cero.');
      return;
    }

    const newMovement = {
      id: Date.now().toString(),
      type,
      description: description.trim(),
      amount: numericAmount,
      category,
      createdAt: new Date().toISOString(),
    };

    onAddMovement(newMovement);
    setDescription('');
    setAmount('');
  };

  const filteredMovements = movements.filter(m =>
    m.description.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Movimientos</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.typeSelector}>
          <Button title="Gasto" color={type === 'expense' ? '#c62828' : '#b0bec5'} onPress={() => setType('expense')} />
          <Button title="Ingreso" color={type === 'income' ? '#2e7d32' : '#b0bec5'} onPress={() => setType('income')} />
        </View>
        <Button title="Agregar Movimiento" onPress={handleAdd} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por descripción o categoría..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredMovements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MovementRow item={item} onDelete={onDeleteMovement} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay movimientos registrados.</Text>}
      />
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
    marginBottom: 12,
    color: '#2f3640',
  },
  form: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#718093',
    marginTop: 20,
  },
});
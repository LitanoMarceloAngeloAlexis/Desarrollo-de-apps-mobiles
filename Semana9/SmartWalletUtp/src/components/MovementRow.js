import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function MovementRow({ item, onDelete }) {
  const isIncome = item.type === 'income';

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.category}>{item.category} • {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.amount, { color: isIncome ? '#2e7d32' : '#c62828' }]}>
          {isIncome ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteButton}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  deleteButton: {
    fontSize: 14,
  },
});
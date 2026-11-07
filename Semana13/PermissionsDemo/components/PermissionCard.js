import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PermissionCard({ title, icon, status, onRequest }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'granted':
        return { text: 'Concedido', color: '#d4edda', textColor: '#155724' };
      case 'denied':
        return { text: 'Denegado', color: '#f8d7da', textColor: '#721c24' };
      default:
        return { text: 'No solicitado', color: '#fff3cd', textColor: '#856404' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[styles.card, { backgroundColor: statusInfo.color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{icon} {title}</Text>
        <Text style={[styles.badge, { color: statusInfo.textColor }]}>
          {statusInfo.text}
        </Text>
      </View>
      
      {status !== 'granted' && (
        <TouchableOpacity style={styles.button} onPress={onRequest}>
          <Text style={styles.buttonText}>Permitir acceso</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
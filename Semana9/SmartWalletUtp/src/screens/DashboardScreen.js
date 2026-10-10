import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';

export default function DashboardScreen({ movements, budget }) {
  const income = movements
    .filter(m => m.type === 'income')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const expense = movements
    .filter(m => m.type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const balance = income - expense;
  
  const budgetUsedPercentage = budget > 0 ? (expense / budget) * 100 : 0;

  if (budget > 0) {
    if (budgetUsedPercentage >= 100) {
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Financiero</Text>
      
      <View style={styles.cardMain}>
        <Text style={styles.cardLabel}>Saldo Total</Text>
        <Text style={[styles.cardValue, { color: balance >= 0 ? '#1b5e20' : '#b71c1c' }]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.rowCards}>
        <View style={[styles.card, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.smallLabel}>Ingresos</Text>
          <Text style={[styles.smallValue, { color: '#2e7d32' }]}>${income.toFixed(2)}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#ffebee' }]}>
          <Text style={styles.smallLabel}>Gastos</Text>
          <Text style={[styles.smallValue, { color: '#c62828' }]}>${expense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.budgetContainer}>
        <Text style={styles.budgetTitle}>Presupuesto Mensual: ${budget.toFixed(2)}</Text>
        <Text style={styles.budgetSub}>Gastado: {budgetUsedPercentage.toFixed(1)}%</Text>
        {budgetUsedPercentage >= 80 && budgetUsedPercentage < 100 && (
          <Text style={styles.alertWarning}>⚠️ Advertencia: Has superado el 80% de tu presupuesto.</Text>
        )}
        {budgetUsedPercentage >= 100 && (
          <Text style={styles.alertDanger}>¡Alerta Crítica! Has superado el 100% de tu presupuesto.</Text>
        )}
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
  cardMain: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: '#718093',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  smallLabel: {
    fontSize: 12,
    color: '#718093',
  },
  smallValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  budgetContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3640',
  },
  budgetSub: {
    fontSize: 14,
    color: '#718093',
    marginTop: 4,
  },
  alertWarning: {
    color: '#f39c12',
    fontWeight: 'bold',
    marginTop: 8,
  },
  alertDanger: {
    color: '#c0392b',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
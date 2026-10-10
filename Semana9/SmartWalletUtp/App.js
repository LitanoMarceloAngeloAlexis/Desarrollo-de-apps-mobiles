import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { loadMovements, saveMovements, loadBudget, saveBudget } from './src/storage/financeStorage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [movements, setMovements] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const loadedMovements = await loadMovements();
      const loadedBudget = await loadBudget();
      setMovements(loadedMovements);
      setBudget(loadedBudget);
      setIsLoading(false);
    };
    initData();
  }, []);

  const handleAddMovement = async (newMovement) => {
    const updated = [newMovement, ...movements];
    setMovements(updated);
    await saveMovements(updated);
  };

  const handleDeleteMovement = async (id) => {
    const updated = movements.filter(m => m.id !== id);
    setMovements(updated);
    await saveMovements(updated);
  };

  const handleUpdateBudget = async (newBudget) => {
    setBudget(newBudget);
    await saveBudget(newBudget);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Cargando SmartWallet...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {currentTab === 'Dashboard' && <DashboardScreen movements={movements} budget={budget} />}
        {currentTab === 'Movements' && (
          <MovementsScreen
            movements={movements}
            onAddMovement={handleAddMovement}
            onDeleteMovement={handleDeleteMovement}
          />
        )}
        {currentTab === 'Settings' && <SettingsScreen budget={budget} onUpdateBudget={handleUpdateBudget} />}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, currentTab === 'Dashboard' && styles.activeTab]} 
          onPress={() => setCurrentTab('Dashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentTab === 'Movements' && styles.activeTab]} 
          onPress={() => setCurrentTab('Movements')}
        >
          <Text style={styles.navText}>Movimientos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentTab === 'Settings' && styles.activeTab]} 
          onPress={() => setCurrentTab('Settings')}
        >
          <Text style={styles.navText}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#dcdde1',
    backgroundColor: '#f5f6fa',
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#dcdde1',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2f3640',
  },
});
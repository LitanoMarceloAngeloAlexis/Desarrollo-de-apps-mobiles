import AsyncStorage from '@react-native-async-storage/async-storage';

const MOVEMENTS_KEY = '@smartwallet/movements';
const BUDGET_KEY = '@smartwallet/budget';
const THEME_KEY = '@smartwallet/theme';

export const saveMovements = async (movements) => {
  try {
    const jsonValue = JSON.stringify(movements);
    await AsyncStorage.setItem(MOVEMENTS_KEY, jsonValue);
  } catch (e) {
    console.error('Error al guardar movimientos:', e);
  }
};

export const loadMovements = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(MOVEMENTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error al cargar movimientos:', e);
    return [];
  }
};

export const saveBudget = async (budget) => {
  try {
    await AsyncStorage.setItem(BUDGET_KEY, budget.toString());
  } catch (e) {
    console.error('Error al guardar presupuesto:', e);
  }
};

export const loadBudget = async () => {
  try {
    const value = await AsyncStorage.getItem(BUDGET_KEY);
    return value != null ? parseFloat(value) : 0;
  } catch (e) {
    console.error('Error al cargar presupuesto:', e);
    return 0;
  }
};
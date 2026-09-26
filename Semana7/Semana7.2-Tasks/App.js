import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@tasks");
      const storedCount = await AsyncStorage.getItem("@completed_count");
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedCount) setCompletedCount(parseInt(storedCount, 10));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    const taskToToggle = tasks.find((t) => t.id === id);
    let newCount = completedCount;

    if (taskToToggle && !taskToToggle.completed) {
      newCount += 1;
    } else if (taskToToggle && taskToToggle.completed) {
      newCount = Math.max(0, newCount - 1);
    }

    setTasks(updatedTasks);
    setCompletedCount(newCount);

    try {
      await AsyncStorage.setItem("@tasks", JSON.stringify(updatedTasks));
      await AsyncStorage.setItem("@completed_count", newCount.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllTasks = async () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar todas las tareas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setTasks([]);
          setCompletedCount(0);
          await AsyncStorage.removeItem("@tasks");
          await AsyncStorage.removeItem("@completed_count");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TaskFlow - Inicio</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllTasks}>
          <Text style={styles.dangerButtonText}>Limpiar Todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counterCard}>
        <Text style={styles.counterText}>
          Tareas completadas: {completedCount}
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskCard, item.completed && styles.taskCompleted]}
            onPress={() => toggleTaskCompletion(item.id)}
          >
            <Text
              style={[styles.taskTitle, item.completed && styles.textCompleted]}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.taskDesc, item.completed && styles.textCompleted]}
            >
              {item.description}
            </Text>
            <Text style={styles.taskStatus}>
              {item.completed ? "Completada" : "Pendiente"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay tareas pendientes. ¡Agrega una!
          </Text>
        }
      />
    </SafeAreaView>
  );
}

function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Por favor completa el título y la descripción.");
      return;
    }

    try {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
      };

      const storedTasks = await AsyncStorage.getItem("@tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);

      await AsyncStorage.setItem("@tasks", JSON.stringify(tasks));

      Alert.alert("Éxito", "Tarea guardada correctamente");
      setTitle("");
      setDescription("");
      navigation.navigate("Home");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>Nueva Tarea</Text>

      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Estudiar React Native"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej. Repasar componentes y navegación"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.primaryButton} onPress={saveTask}>
        <Text style={styles.primaryButtonText}>Guardar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsScreen() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [intervalSec, setIntervalSec] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, intervalSec);

    return () => clearInterval(timer);
  }, [intervalSec]);

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>Configuración y Reloj</Text>

      <View style={styles.clockCard}>
        <Text style={styles.clockLabel}>Hora Actual:</Text>
        <Text style={styles.clockText}>{time}</Text>
      </View>

      <Text style={styles.label}>Velocidad de actualización del reloj:</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalSec === 1000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalSec(1000)}
        >
          <Text style={intervalSec === 1000 ? styles.textWhite : null}>1s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalSec === 3000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalSec(3000)}
        >
          <Text style={intervalSec === 3000 ? styles.textWhite : null}>3s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalSec === 5000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalSec(5000)}
        >
          <Text style={intervalSec === 5000 ? styles.textWhite : null}>5s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inicio" }}
        />
        <Tab.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: "Nueva Tarea" }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Ajustes" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  counterCard: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },

  counterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d47a1",
  },

  taskCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },

  taskCompleted: {
    backgroundColor: "#e8f5e9",
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },

  taskDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  taskStatus: {
    ontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },

  textCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },

  label: {
    fontSize: 16,
    marginVertical: 8,
    color: "#333",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },

  textArea: { 
    height: 80, 
    textAlignVertical: "top" 
  },

  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },

  dangerButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  dangerButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 12 
  },

  clockCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },

  clockLabel: { 
    fontSize: 14, 
    color: "#666", 
    marginBottom: 5 
  },

  clockText: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#007AFF" 
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  optionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 6,
  },

  optionSelected: { 
    backgroundColor: "#007AFF" 
  },

  textWhite: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  
});

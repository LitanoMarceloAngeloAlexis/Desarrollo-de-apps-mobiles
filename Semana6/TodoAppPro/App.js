import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@tasks_key';

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#666');
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
    updateMessageAndColor();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error al cargar las tareas', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar las tareas', error);
    }
  };

  const updateMessageAndColor = () => {
    const total = tasks.length;
    const pendientes = tasks.filter(t => !t.completed).length;

    if (total === 0) {
      setMessage('No hay tareas pendientes.');
      setMessageColor('#666');
    } else if (pendientes >= 1 && pendientes <= 3) {
      setMessage(`Total de tareas: ${total} (Vas bien)`);
      setMessageColor('#2e7d32');
    } else if (pendientes >= 4 && pendientes <= 5) {
      setMessage(`Total de tareas: ${total} (Cuidado, se acumulan)`);
      setMessageColor('#f57c00');
    } else if (pendientes > 5) {
      setMessage(`⚠️ Demasiadas tareas pendientes (${pendientes})`);
      setMessageColor('#d32f2f');
    } else {
      setMessage(`Total de tareas: ${total}`);
      setMessageColor('#666');
    }
  };

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Error', 'La tarea no puede estar vacía.');
      return;
    }

    const isDuplicate = tasks.some(
      t => t.text.toLowerCase() === taskText.trim().toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert('Aviso', 'Esta tarea ya existe en la lista.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTask = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
      createdAt: formattedDate,
    };

    const updatedTasks = [newTask, ...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    setTasks(updatedTasks);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }).sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteCompletedTasks = () => {
    setTasks(tasks.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pendientes') return !t.completed;
    if (filter === 'Completadas') return t.completed;
    return true;
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi To-Do List</Text>
        <Text style={styles.subTitle}>UTP - Desarrollo de Apps Móviles</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una nueva tarea..."
          placeholderTextColor="#888"
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.messageText, { color: messageColor }]}>
        {message}
      </Text>

      <View style={styles.filterContainer}>
        {['Todas', 'Pendientes', 'Completadas'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity 
              style={styles.taskInfo} 
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
                {item.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                  {item.text}
                </Text>
                <Text style={styles.dateText}>{item.createdAt}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#ff5252" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay tareas para mostrar.</Text>
        }
      />

      {tasks.some(t => t.completed) && (
        <TouchableOpacity style={styles.clearButton} onPress={deleteCompletedTasks}>
          <Text style={styles.clearButtonText}>Eliminar completadas</Text>
        </TouchableOpacity>
      )}

      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dateText: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontStyle: 'italic',
  },
  clearButton: {
    backgroundColor: '#ff5252',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
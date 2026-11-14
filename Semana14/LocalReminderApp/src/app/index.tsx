import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEY = '@local_reminders';

export default function HomeScreen() {
  const [title, setTitle] = useState('');
  const [seconds, setSeconds] = useState('');
  const [reminders, setReminders] = useState<any[]>([]);

  // 2. SOLUCIÓN 1: Inicializar useRef con null (para evitar el error de argumentos)
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
    loadReminders();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Interacción con notificación:', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
    }
  };

  const saveReminders = async (newReminders: any[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
    } catch (error) {
      console.error('Error al guardar recordatorios:', error);
    }
  };

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permiso denegado', '¡No podrás recibir notificaciones sin permisos!');
        return;
      }
    } else {
      console.log('Usa un dispositivo físico para probar las notificaciones correctamente.');
    }
  }

  const handleAddReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para el recordatorio.');
      return;
    }
    const secNum = parseInt(seconds, 10);
    if (isNaN(secNum) || secNum <= 0) {
      Alert.alert('Error', 'Ingresa un tiempo válido en segundos mayor a 0.');
      return;
    }

    try {
      let triggerId = 'web-mock-id-' + Date.now();

      if (Platform.OS !== 'web') {
        triggerId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recordatorio',
            body: title,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secNum,
            repeats: false,
          },
        });
      } else {
        console.warn('Las notificaciones nativas no se pueden probar en la Web. Solo se guardará en la lista.');
      }

      const newReminder = {
        id: triggerId,
        title: title.trim(),
        seconds: secNum,
        createdAt: new Date().toLocaleTimeString(),
      };

      const updatedList = [newReminder, ...reminders];
      setReminders(updatedList);
      await saveReminders(updatedList);

      setTitle('');
      setSeconds('');
      
      if (Platform.OS === 'web') {
        Alert.alert('Aviso Web', 'Recordatorio guardado en la lista (Las notificaciones push solo funcionan en Android/iOS).');
      } else {
        Alert.alert('Éxito', `Recordatorio programado para dentro de ${secNum} segundos.`);
      }
    } catch (error) {
      console.error('Error al programar notificación:', error);
      Alert.alert('Error', 'No se pudo programar la notificación.');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const filtered = reminders.filter((item) => item.id !== id);
      setReminders(filtered);
      await saveReminders(filtered);
      Alert.alert('Eliminado', 'El recordatorio y su notificación asociada fueron cancelados.');
    } catch (error) {
      console.error('Error al eliminar recordatorio:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.innerContainer}
      >
        <Text style={styles.headerTitle}>Mis Recordatorios</Text>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="¿Qué deseas recordar?"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Tiempo en segundos (ej. 10)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={seconds}
            onChangeText={setSeconds}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddReminder}>
            <Text style={styles.buttonText}>Programar Recordatorio</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeader}>Recordatorios Activos</Text>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDetails}>
                  ⏱️ {item.seconds} seg | {item.createdAt}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReminder(item.id)}
              >
                <Text style={styles.deleteButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay recordatorios pendientes.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#2f3640',
  },
  button: {
    backgroundColor: '#40739e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f3640',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 10,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3640',
    marginBottom: 4,
  },
  reminderDetails: {
    fontSize: 12,
    color: '#718093',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#a4b0be',
    marginTop: 20,
    fontSize: 15,
  },
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let Accelerometer: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  
  const Sensors = require('expo-sensors');
  Accelerometer = Sensors.Accelerometer;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ruta, setRuta] = useState<Coordinate[]>([]);
  const [distanciaTotal, setDistanciaTotal] = useState<number>(0);
  const [ultimaPosLocal, setUltimaPosLocal] = useState<Coordinate | null>(null);

  const [accelerometerData, setAccelerometerData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [pasos, setPasos] = useState<number>(0);

  const [velocidad, setVelocidad] = useState<number>(0);

  useEffect(() => {
    cargarUltimaUbicacion();

    let subscriptionLocation: Location.LocationSubscription | null = null;
    let subscriptionAccel: any = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de acceso a la ubicación fue denegado');
        return;
      }

      subscriptionLocation = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (newLoc) => {
          const { latitude, longitude, speed } = newLoc.coords;
          const currentCoord: Coordinate = { latitude, longitude };

          setLocation(newLoc.coords);
          if (speed !== null && speed >= 0) setVelocidad(speed * 3.6);

          setRuta((prevRuta) => {
            if (prevRuta.length > 0) {
              const ultima = prevRuta[prevRuta.length - 1];
              const distanciaTramo = calcularDistancia(
                ultima.latitude,
                ultima.longitude,
                latitude,
                longitude
              );
              setDistanciaTotal((prevDist) => prevDist + distanciaTramo);
            }
            return [...prevRuta, currentCoord];
          });

          guardarUbicacionLocal(currentCoord);
        }
      );
    })();

    if (Platform.OS !== 'web' && Accelerometer) {
      Accelerometer.setUpdateInterval(500);
      subscriptionAccel = Accelerometer.addListener((data: AccelerometerData) => {
        setAccelerometerData(data);
        const magnitud = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        if (magnitud > 1.2) {
          setPasos((p) => p + 1);
        }
      });
    }

    return () => {
      if (subscriptionLocation) subscriptionLocation.remove();
      if (subscriptionAccel) subscriptionAccel.remove();
    };
  }, []);

  const guardarUbicacionLocal = async (coords: Coordinate) => {
    try {
      await AsyncStorage.setItem('@ultima_ubicacion', JSON.stringify(coords));
    } catch (e) {
      console.error('Error al guardar en AsyncStorage', e);
    }
  };

  const cargarUltimaUbicacion = async () => {
    try {
      const value = await AsyncStorage.getItem('@ultima_ubicacion');
      if (value !== null) {
        setUltimaPosLocal(JSON.parse(value));
      }
    } catch (e) {
      console.error('Error al leer de AsyncStorage', e);
    }
  };

  const reiniciarMetricas = () => {
    setDistanciaTotal(0);
    setPasos(0);
    setRuta([]);
    Alert.alert('Reiniciado', 'Se han reseteado los contadores.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.loadingMap}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
             Estás en la versión Web.{'\n\n'}Para probar el GPS, el Mapa y el Acelerómetro, escanea el código QR con la app **Expo Go** en tu celular.
          </Text>
        </View>
      ) : location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Mi ubicación actual"
          />
          <Polyline coordinates={ruta} strokeColor="#0000FF" strokeWidth={4} />
        </MapView>
      ) : (
        <View style={styles.loadingMap}>
          <Text>{errorMsg ? errorMsg : 'Cargando mapa y GPS...'}</Text>
        </View>
      )}

      <View style={styles.panel}>
        <Text style={styles.titulo}>Fitness Tracker UTP</Text>
        <Text> Latitud: {location ? location.latitude.toFixed(4) : '---'}, Lon: {location ? location.longitude.toFixed(4) : '---'}</Text>
        <Text> Distancia Recorrida: {distanciaTotal.toFixed(3)} km</Text>
        <Text> Velocidad Promedio: {velocidad.toFixed(1)} km/h</Text>
        <Text> Pasos Estimados: {pasos}</Text>
        <Text style={styles.sensorText}>
           Acelerómetro X: {accelerometerData.x.toFixed(2)} | Y: {accelerometerData.y.toFixed(2)} | Z: {accelerometerData.z.toFixed(2)}
        </Text>

        {ultimaPosLocal && (
          <Text style={styles.localText}>
             Última posición cargada del almacenamiento local: ({ultimaPosLocal.latitude.toFixed(4)}, {ultimaPosLocal.longitude.toFixed(4)})
          </Text>
        )}

        <View style={{ marginTop: 10 }}>
          <Button title="Reiniciar Recorrido" onPress={reiniciarMetricas} color="#ff5252" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.5 },
  loadingMap: { width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0', padding: 20 },
  panel: { flex: 0.5, padding: 15, backgroundColor: '#f8f9fa', justifyContent: 'space-around' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  sensorText: { fontSize: 12, color: '#666' },
  localText: { fontSize: 11, fontStyle: 'italic', color: '#00796b' },
});
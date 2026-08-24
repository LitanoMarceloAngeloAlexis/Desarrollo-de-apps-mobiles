import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import PerfilUsuario from './components/PerfilUsuario';

export default function App() {
  return (
    <SafeAreaView style={{flex:1, justifyContent: "center", alignItems: "center"}}>
      <PerfilUsuario nombre={"Juan Perez"} edad={28} photo={"https://static.vecteezy.com/system/resources/previews/004/987/864/non_2x/cute-beagle-cartoon-happy-cartoon-puppy-sitting-beagle-puppy-free-vector.jpg"}/>
      <PerfilUsuario nombre={"Ana Lopez"} edad={34} photo={""}/>
    </SafeAreaView>
  );
}


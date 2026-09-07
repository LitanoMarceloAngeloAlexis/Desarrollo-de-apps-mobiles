import { Button, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './components/HomeTab';
import { createDrawerNavigator } from '@react-navigation/drawer';

function PerfilScreen() {
  return <Text>Pantalla de Perfil</Text>;
}

function ConfigurationScreen(){
  return <Text>Pantalla de configuración</Text>
}

const Drawer = createDrawerNavigator();

function LoginScreen({ navigation }){
  return(
  <Button title="Ingresar" onPress={() => navigation.navigate('Home')}/>
  );
}

function HomeScreen() {
  return (
      <Stack.Navigator>

        <Stack.Screen name="Inicio" component={HomeTabs} />

        <Stack.Screen name="Perfil" component={PerfilScreen} />

        <Stack.Screen name="Configuracion" component={ConfigurationScreen} />

      </Stack.Navigator>
    )
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

      </Stack.Navigator>

    </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import * as React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ChatsScreen() {
    return <Text>Lista de chats</Text>;
}

function EstadosScreen() {
    return <Text>Estados</Text>;
}

function LlamadasScreen() {
    return <Text>Llamadas</Text>;
}

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="Estados" component={EstadosScreen} />
            <Tab.Screen name="Llamadas" component={LlamadasScreen} />
        </Tab.Navigator>
    );
}
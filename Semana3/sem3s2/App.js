import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { UserCard } from './components/UserCard';

export default function App() {
    const employees = [
        { id: 1, name: 'Ana Beltrán', age: 28, photo: 'https://www.unoi.com.co/wp-content/uploads/2024/06/portada-formar-seres-humanos-plenos.jpg ', role: 'Desarrolladora Frontend', isOnline: true },
        { id: 2, name: 'Luis García', age: 34, photo: 'https://www.aprender21.com/imagenes/blog/funciones-recursos-humanos-hero.jpg', role: 'Ingeniero DevOps', isOnline: false },
        { id: 3, name: 'María Fernández', age: 26, photo: 'https://glocalthinking.com/wp-content/uploads/2019/03/Humanos-vs-Maquinas.png', role: 'Diseñadora UX/UI', isOnline: true },
        { id: 4, name: 'Carlos Mendoza', age: 41, photo: 'https://s3.amazonaws.com/rtvc-assets-senalcolombia.gov.co/s3fs-public/field/image/que-son-derechos-humanos-definicion-dia-mundial-portada2.jpg', role: 'Gerente de Proyectos', isOnline: false },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.grid}>
                {employees.map((emp) => (
                    <UserCard
                        key={emp.id}
                        name={emp.name}
                        age={emp.age}
                        photo={emp.photo}
                        role={emp.role}
                        isOnline={emp.isOnline}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        flexGrow: 1,
    },
    grid: {
        height:'96vh',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
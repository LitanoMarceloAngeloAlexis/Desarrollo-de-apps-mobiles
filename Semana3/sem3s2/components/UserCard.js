import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

export const UserCard = ({ name, age, photo, role, isOnline }) => {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;

    return (
        <View style={[styles.card, { width: isLargeScreen ? '48%' : '100%' }]}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: photo }}
                    style={styles.image}
                    resizeMode="cover"
                    accessible
                    accessibilityLabel={`Foto de perfil de ${name}`}
                />
                {isOnline && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.age}>{`Edad: ${age}`}</Text>
                {role ? <Text style={styles.role} numberOfLines={1}>{role}</Text> : null}
            </View>
        </View>
    );
};

UserCard.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    role: PropTypes.string,
    isOnline: PropTypes.bool,
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#0b132b',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f2f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    onlineBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2ecc71',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    infoContainer: {
        marginTop: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1c2541',
        marginBottom: 2,
    },
    age: {
        fontSize: 14,
        fontWeight: '600',
        color: '#27ae60',
        marginBottom: 4,
    },
    role: {
        fontSize: 12,
        color: '#7f8c8d',
    },
});
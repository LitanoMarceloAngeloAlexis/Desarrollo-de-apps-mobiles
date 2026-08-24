import { View, Text, StyleSheet, PixelRatio } from "react-native";

const PerfilUsuario = ({ nombre, edad }) => {

return (

    <View style={styles.container}>
        <View style={styles.infoBox}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{nombre}</Text>
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.label}>Edad:</Text>
            <Text style={styles.value}>{edad}</Text>
        </View>
    </View>

);

};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "90%",
        margin: "5%",
        padding: PixelRatio.get() * 5,
        borderWidth: 1,
        borderColor: " #4A90E2",
        borderRadius: PixelRatio.get() * 3,
        backgroundColor: "#EAF2FB"
    },

    infoBox: {
        flex: 1,
        alignItems: "center",
    },

    label: {
        fontSize: PixelRatio.get() * 6,
        fontWeight: "bold",
        color: "#333",
    },

    value: {
        fontSize: PixelRatio.get() * 5,
        color: "#555",
    },

});

export default PerfilUsuario;
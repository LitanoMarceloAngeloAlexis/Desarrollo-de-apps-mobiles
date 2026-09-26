import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const INITIAL_NEWS = [
  {
    id: "1",
    title: "Nueva versión de React Native lanzada",
    content:
      "Se han mejorado el rendimiento y la arquitectura de Hermes en esta nueva versión.",
    category: "Tecnología",
  },
  {
    id: "2",
    title: "Avances en Inteligencia Artificial",
    content:
      "Los nuevos modelos multimodales permiten una interacción más fluida y natural.",
    category: "Ciencia",
  },
  {
    id: "3",
    title: "Tendencias de Desarrollo Móvil",
    content:
      "El uso de componentes nativos optimizados domina el mercado actual.",
    category: "Desarrollo",
  },
];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation, route }) {
  const [news, setNews] = useState(INITIAL_NEWS);
  const [refreshing, setRefreshing] = useState(false);
  const intervalTime = route.params?.intervalTime || 5000;

  useEffect(() => {
    const timer = setInterval(() => {
      const newArticle = {
        id: Date.now().toString(),
        title: `Noticia en vivo #${Math.floor(Math.random() * 100)}`,
        content:
          "Este es un artículo generado automáticamente por el temporizador de NewsFlow.",
        category: "Actualidad",
      };
      setNews((prev) => [newArticle, ...prev]);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [intervalTime]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNews(INITIAL_NEWS);
      setRefreshing(false);
    }, 1000);
  }, []);

  const clearAllNews = () => setNews([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>NewsFlow - Inicio</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllNews}>
          <Text style={styles.dangerButtonText}>Limpiar Todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { article: item })}
          >
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // Optimizaciones solicitadas
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

function DetailScreen({ route }) {
  const { article } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("@favorites");
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setIsFavorite(favorites.some((fav) => fav.id === article.id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("@favorites");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        favorites = favorites.filter((fav) => fav.id !== article.id);
      } else {
        favorites.push(article);
      }

      await AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.detailCategory}>{article.category}</Text>
      <Text style={styles.detailTitle}>{article.title}</Text>
      <Text style={styles.detailContent}>{article.content}</Text>

      <TouchableOpacity
        style={[
          styles.favButton,
          isFavorite ? styles.removeFav : styles.addFav,
        ]}
        onPress={toggleFavorite}
      >
        <Text style={styles.favButtonText}>
          {isFavorite ? "Eliminar de Favoritos" : "Guardar en Favoritos"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("@favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const updated = favorites.filter((item) => item.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem("@favorites", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Mis Favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("Detail", { article: item })}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes favoritos guardados.</Text>
        }
      />
    </SafeAreaView>
  );
}

function SettingsScreen({ navigation }) {
  const [intervalTime, setIntervalTime] = useState(5000);

  const resetApp = async () => {
    try {
      await AsyncStorage.clear();
      alert("¡Aplicación reseteada con éxito!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>Configuración</Text>

      <Text style={styles.label}>Intervalo de actualización automática:</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalTime === 3000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalTime(3000)}
        >
          <Text>3s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalTime === 5000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalTime(5000)}
        >
          <Text>5s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            intervalTime === 10000 && styles.optionSelected,
          ]}
          onPress={() => setIntervalTime(10000)}
        >
          <Text>10s</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => {
          navigation.navigate("HomeTab", {
            screen: "Home",
            params: { intervalTime },
          });
          alert(`Intervalo actualizado a ${intervalTime / 1000}s`);
        }}
      >
        <Text style={styles.applyButtonText}>Aplicar Configuración</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButtonLarge} onPress={resetApp}>
        <Text style={styles.dangerButtonText}>
          Resetear App (AsyncStorage.clear)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Detalle de Noticia" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateFavCount = async () => {
      try {
        const res = await AsyncStorage.getItem("@favorites");
        const items = res ? JSON.parse(res) : [];
        setFavCount(items.length);
      } catch (e) {
        console.error(e);
      }
    };

    updateFavCount();
    const interval = setInterval(updateFavCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: "Noticias", headerShown: false }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesScreen}
          options={{
            title: "Favoritos",
            headerShown: false,
            tabBarBadge: favCount > 0 ? favCount : undefined,
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{ title: "Ajustes", headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
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
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  cardCategory: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailCategory: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  detailContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  favButton: { padding: 15, borderRadius: 8, alignItems: "center" },
  addFav: { backgroundColor: "#007AFF" },
  removeFav: { backgroundColor: "#FF3B30" },
  favButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  deleteText: { color: "#FF3B30", fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#888", marginTop: 40 },
  dangerButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dangerButtonLarge: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  dangerButtonText: { color: "#fff", fontWeight: "bold" },
  label: { fontSize: 16, marginVertical: 10, color: "#333" },
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
  optionSelected: { backgroundColor: "#007AFF" },
  applyButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

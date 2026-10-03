import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Button,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Stack = createNativeStackNavigator();
const STORAGE_KEY = '@limit_pokemon_config';

function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLimit = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLimit !== null) {
        setLimit(parseInt(savedLimit, 10));
      }
    } catch (e) {
      console.error('Error al cargar configuración', e);
    }
  };

  const fetchPokemon = async (reset = false, currentOffset = 0, currentLimit = limit) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(false);

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${currentLimit}&offset=${currentOffset}`
      );
      const data = response.data;

      const detailedResults = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await axios.get(pokemon.url);
          const details = res.data;
          
          return {
            name: pokemon.name,
            url: pokemon.url,
            id: details.id,
            sprite: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
          };
        })
      );

      if (reset) {
        setPokemonList(detailedResults);
      } else {
        setPokemonList((prev) => [...prev, ...detailedResults]);
      }

      if (!data.next) {
        setHasMore(false);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemon(true, 0, limit);
  }, [limit]);

  const onRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchPokemon(true, 0, limit);
  };

  const loadMorePokemon = () => {
    if (!loadingMore && hasMore && !searchQuery) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchPokemon(false, nextOffset, limit);
    }
  };

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && pokemonList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e30000" />
        <Text style={styles.loadingText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error && pokemonList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ocurrió un error al cargar los datos.</Text>
        <Button title="Reintentar" onPress={() => fetchPokemon(true, 0, limit)} color="#e30000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar Pokémon..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button
          title="Configuración"
          onPress={() => navigation.navigate('Settings', { updateLimit: setLimit })}
        />
      </View>

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detalle', { pokemon: item })}
          >
            <Image source={{ uri: item.sprite }} style={styles.sprite} />
            <View>
              <Text style={styles.pokemonName}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
              <Text style={styles.pokemonUrl} numberOfLines={1}>{item.url}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#e30000" />
            </View>
          ) : null
        }
      />

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Mostrando {filteredPokemon.length} Pokémon cargados
        </Text>
      </View>
    </SafeAreaView>
  );
}

function DetailScreen({ route }) {
  const { pokemon } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Image source={{ uri: pokemon.sprite }} style={styles.detailSprite} />
      <Text style={styles.detailTitle}>
        {pokemon.name.toUpperCase()}
      </Text>
      <View style={styles.detailInfoBox}>
        <Text style={styles.detailText}>ID: #{pokemon.id}</Text>
        <Text style={styles.detailText}>Altura: {pokemon.height / 10} m</Text>
        <Text style={styles.detailText}>Peso: {pokemon.weight / 10} kg</Text>
      </View>
    </View>
  );
}

function SettingsScreen({ route, navigation }) {
  const { updateLimit } = route.params;
  const options = [10, 20, 50];

  const handleSelectLimit = async (newLimit) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLimit.toString());
      updateLimit(newLimit);
      navigation.goBack();
    } catch (e) {
      console.error('Error al guardar configuración', e);
    }
  };

  return (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Pokémon por página:</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.optionButton}
          onPress={() => handleSelectLimit(opt)}
        >
          <Text style={styles.optionText}>{opt} Pokémon</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pokédex - UTP' }} />
        <Stack.Screen name="Detalle" component={DetailScreen} options={{ title: 'Detalle Pokémon' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15,
  },
  headerBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    height: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sprite: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pokemonUrl: {
    fontSize: 12,
    color: '#888',
    width: 250,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  counterContainer: {
    padding: 10,
    backgroundColor: '#e30000',
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  detailSprite: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailInfoBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    backgroundColor: '#fafafa',
  },
  detailText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});
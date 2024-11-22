import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Platform, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ItemCard from './components/ItemCard';
import { fetchItems } from './services/api';
import { Item } from './types/types';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider } from './store/CartContext';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    try {
      const filtered = items.filter(item => {
        return item && item.name && 
          item.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredItems(filtered);
    } catch (err) {
      console.error('Error filtering items:', err);
      setError('Error filtering items');
    }
  }, [searchQuery, items]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await fetchItems();
      
      const validItems = data.filter(item => 
        item && 
        typeof item === 'object' && 
        item.name && 
        item.price &&
        item.image
      );

      setItems(validItems);
      setFilteredItems(validItems);
      setError(null);
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CartProvider>
        <StatusBar style="dark" backgroundColor="#356b82" />
        <Header />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <View style={styles.listBackground}>
          <FlatList
            key="grid-2"
            data={filteredItems}
            renderItem={({ item }) => (
              <ItemCard item={item} />
            )}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No items found</Text>
            )}
          />
        </View>
        <View style={styles.navBar}>
          <View style={styles.navItem}>
            <Ionicons name="home-outline" size={24} color='#356b82' />
            <Text style={styles.navText}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="grid-outline" size={24} color='#356b82' />
            <Text style={styles.navText}>Browse</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="receipt-outline" size={24} color='#356b82' />
            <Text style={styles.navText}>Orders</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="cart-outline" size={24} color='#356b82' />
            <Text style={styles.navText}>Cart</Text>
          </View>
        </View>
      </CartProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#356b82',
  },
  listContainer: {
    padding: 40,
  },
  listBackground: {
    backgroundColor: "#bddae0",
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingVertical: 15
  },
  errorText: {
    padding: 16,
    color: 'red',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  loadingText: {
    padding: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#356b82',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});
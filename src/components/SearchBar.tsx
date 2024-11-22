import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search Items"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#356b82',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 8,
    color: "#356b82",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#356b82"
  },
});

export default SearchBar;
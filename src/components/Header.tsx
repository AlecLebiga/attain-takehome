import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Order Book</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#356b82',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fcfcfd'
  },
});

export default Header;
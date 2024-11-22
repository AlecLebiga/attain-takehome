import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Item } from '../types/types';
import { useCart } from '../store/CartContext';
import ItemOverlay from './ItemOverlay';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth / 2) - 60;

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { state } = useCart();
  const [currentQuantity, setCurrentQuantity] = useState(0);
  
  useEffect(() => {
    const cartItem = state.items.find(i => i.id === item.id);
    setCurrentQuantity(cartItem ? cartItem.quantity : 0);
  }, [state.items, item.id]);

  const formatPrice = (price: number | string | undefined) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice ? numPrice.toFixed(2) : '0.00';
  };

  const isOnSale = item.discounted_price !== undefined && 
                   item.discounted_price !== null && 
                   item.discounted_price !== '';

  return (
    <>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {isOnSale && (
            <View style={styles.saleContainer}>
              <Text style={styles.saleText}>sale</Text>
            </View>
          )}
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              currentQuantity > 0 && styles.quantityButton
            ]}
            onPress={() => setIsOverlayVisible(true)}
          >
            {currentQuantity > 0 ? (
              <Text style={styles.quantityText}>{currentQuantity}</Text>
            ) : (
              <Text style={styles.plusSign}>+</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.supplier} numberOfLines={1}>
            {item.supplier}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              {isOnSale ? (
                <>
                  <Text style={styles.discountedPrice}>
                    ${formatPrice(item.discounted_price)}
                  </Text>
                  <Text style={styles.originalPrice}>
                    ${formatPrice(item.price)}
                  </Text>
                </>
              ) : (
                <Text style={styles.price}>
                  ${formatPrice(item.price)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      
      <ItemOverlay 
        item={item}
        isVisible={isOverlayVisible}
        onClose={() => setIsOverlayVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 2, 
    paddingVertical: 16,
    paddingHorizontal: 10
  },
  image: {
    width: '100%',
    height: itemWidth * 0.65, 
    marginVertical: 10
  },
  imageContainer: {
    position: 'relative'
  },
  saleContainer: {
    position: 'absolute',
    left: 8,
    top: 16,
    backgroundColor: '#43cc83',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 16,
    zIndex: 1,
  },
  saleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  addButton: {
    position: 'absolute',
    right: 8,
    bottom: -2,
    backgroundColor: '#61a5c2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#43cc83',
  },
  plusSign: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
  },
  content: {
    padding: 6
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#356b82',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  supplier: {
    fontSize: 12,
    color: '#9cc6d8',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
    textDecorationLine: 'underline'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 12,
    color: '#61a5c2',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  discountedPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#43cc83',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  originalPrice: {
    fontSize: 11,
    color: '#eb3e2f',
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
});

export default ItemCard;
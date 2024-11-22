import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
import { Item } from '../types/types';
import { useCart } from '../store/CartContext';

interface ItemOverlayProps {
  item: Item;
  isVisible: boolean;
  onClose: () => void;
}

const { height, width } = Dimensions.get('window');

const ItemOverlay = ({ item, isVisible, onClose }: ItemOverlayProps) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch, state } = useCart();
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (isVisible) {
      const currentItem = state.items.find(i => i.id === item.id);
      setQuantity(currentItem ? currentItem.quantity : 1);
      
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleAddToCart = () => {
    const existingItem = state.items.find(i => i.id === item.id);
    
    if (!existingItem && quantity > 0) {
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: item
      });
    }
    
    if (quantity > 0) {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { 
          id: item.id, 
          quantity: quantity 
        } 
      });
    } else {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: item.id
      });
    }
    onClose();
  };

  const formatPrice = (price: number | string | undefined) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice ? numPrice.toFixed(2) : '0.00';
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.contentContainer}>
            <View style={styles.rowContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.supplier}>{item.supplier}</Text>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <View style={styles.priceContainer}>
                  {item.discounted_price ? (
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
            
            <View style={styles.bottomContainer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  onPress={() => quantity > 1 && setQuantity(q => q - 1)}
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => setQuantity(q => q + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addButtonText}>
                  Add to Cart - ${formatPrice(
                    item.discounted_price 
                      ? Number(item.discounted_price) * quantity
                      : Number(item.price) * quantity
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  supplier: {
    fontSize: 14,
    color: '#9cc6d8',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
    textDecorationLine: 'underline'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#356b82',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    color: '#61a5c2',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#43cc83',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  originalPrice: {
    fontSize: 16,
    color: '#eb3e2f',
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
  bottomContainer: {
    gap: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#61a5c2',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#DDD',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 20,
    fontWeight: '600',
    color: '#356b82',
  },
  addButton: {
    backgroundColor: '#43cc83',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Gill Sans' : 'Roboto',
  },
});

export default ItemOverlay;
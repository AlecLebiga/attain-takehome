import React, { createContext, useContext, useReducer } from 'react';
import { CartState, CartItem, Item } from '../types/types';

type CartAction =
    | { type: 'ADD_ITEM'; payload: Item }
    | { type: 'REMOVE_ITEM'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } };

const initialState: CartState = {
    items: [],
    subtotal: 0
};

const calculateSubtotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        const price = item.discounted_price 
            ? parseFloat(item.discounted_price) 
            : item.price;
        return total + (price * item.quantity);
    }, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    items: updatedItems,
                    subtotal: calculateSubtotal(updatedItems)
                };
            }
            
            const newItems = [...state.items, { ...action.payload, quantity: 1 }];
            return {
                items: newItems,
                subtotal: calculateSubtotal(newItems)
            };
        }
        case 'REMOVE_ITEM': {
            const updatedItems = state.items.filter(item => item.id !== action.payload);
            return {
                items: updatedItems,
                subtotal: calculateSubtotal(updatedItems)
            };
        }
        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0);
            
            return {
                items: updatedItems,
                subtotal: calculateSubtotal(updatedItems)
            };
        }
        default:
            return state;
    }
};

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
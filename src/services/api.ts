import axios from 'axios';
import { Item } from '../types/types';

const API_URL = 'https://retoolapi.dev/f0ee0v/items';

export const fetchItems = async (): Promise<Item[]> => {
    try {
        const response = await axios.get(API_URL);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
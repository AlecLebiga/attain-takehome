export interface Item {
    id: number;
    name: string;
    price: number;
    image: string;
    discounted_price?: string;
    supplier: string;
}

export interface CartItem extends Item {
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    subtotal: number;
}
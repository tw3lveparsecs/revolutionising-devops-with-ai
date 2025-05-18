// Data models for the Star Wars Collectibles application

export interface Collectible {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  quantity?: number;
  rarity?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  joinedDate: string;
}

export interface Order {
  id?: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
}

export interface OrderItem {
  collectibleId: string;
  collectibleName?: string;
  quantity: number;
  pricePerItem: number;
}

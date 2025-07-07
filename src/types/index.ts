export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'attendant';
  password: string;
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  serviceType: 'maintenance' | 'replacement';
  createdAt: Date;
}

export interface ServiceOrder {
  id: string;
  customerId: string;
  description: string;
  equipment: string;
  createdAt: Date;
  status: 'analyzing' | 'fixed' | 'waiting_parts' | 'completed';
  technician: string;
  observations: string;
  usedParts: string[];
}

export interface Product {
  id: string;
  name: string;
  type: 'physical' | 'virtual';
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  description: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  createdAt: Date;
  technician: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  createdAt: Date;
}
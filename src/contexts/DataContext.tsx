import React, { createContext, useContext, useState } from 'react';
import { Customer, ServiceOrder, Product, Sale, StockMovement } from '../types';

interface DataContextType {
  customers: Customer[];
  serviceOrders: ServiceOrder[];
  products: Product[];
  sales: Sale[];
  stockMovements: StockMovement[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addServiceOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => void;
  updateServiceOrder: (id: string, updates: Partial<ServiceOrder>) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Demo data
const demoCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-10',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    address: 'Rua A, 123',
    serviceType: 'maintenance',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpf: '987.654.321-10',
    phone: '(11) 88888-8888',
    email: 'maria@email.com',
    address: 'Rua B, 456',
    serviceType: 'replacement',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    cpf: '456.789.123-45',
    phone: '(11) 77777-7777',
    email: 'carlos@email.com',
    address: 'Rua C, 789',
    serviceType: 'maintenance',
    createdAt: new Date('2024-01-25'),
  },
];

const demoProducts: Product[] = [
  {
    id: '1',
    name: 'HD 1TB',
    type: 'physical',
    category: 'Storage',
    quantity: 15,
    minQuantity: 5,
    price: 250.00,
    description: 'Hard Drive 1TB SATA',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Memória RAM 8GB',
    type: 'physical',
    category: 'Memory',
    quantity: 3,
    minQuantity: 5,
    price: 180.00,
    description: 'DDR4 8GB 2400MHz',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Windows 11 Pro',
    type: 'virtual',
    category: 'Software',
    quantity: 50,
    minQuantity: 10,
    price: 350.00,
    description: 'Licença Windows 11 Pro',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    name: 'SSD 500GB',
    type: 'physical',
    category: 'Storage',
    quantity: 8,
    minQuantity: 3,
    price: 320.00,
    description: 'SSD SATA 500GB',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Placa de Vídeo GTX 1660',
    type: 'physical',
    category: 'Graphics',
    quantity: 2,
    minQuantity: 3,
    price: 1200.00,
    description: 'NVIDIA GTX 1660 6GB',
    createdAt: new Date('2024-01-18'),
  },
];

const demoServiceOrders: ServiceOrder[] = [
  {
    id: '1',
    customerId: '1',
    description: 'Computador não liga',
    equipment: 'Desktop Dell',
    createdAt: new Date('2024-01-25'),
    status: 'analyzing',
    technician: 'Técnico João',
    observations: 'Verificar fonte de alimentação',
    usedParts: [],
  },
  {
    id: '2',
    customerId: '2',
    description: 'Tela azul frequente',
    equipment: 'Notebook Lenovo',
    createdAt: new Date('2024-01-22'),
    status: 'waiting_parts',
    technician: 'Técnico João',
    observations: 'Necessário trocar memória RAM',
    usedParts: ['2'],
  },
  {
    id: '3',
    customerId: '3',
    description: 'Sistema lento',
    equipment: 'Desktop HP',
    createdAt: new Date('2024-01-28'),
    status: 'completed',
    technician: 'Técnico Maria',
    observations: 'Instalado SSD e migrado sistema',
    usedParts: ['4'],
  },
];

const demoSales: Sale[] = [
  {
    id: '1',
    customerId: '1',
    products: [
      { productId: '1', quantity: 1, price: 250.00 },
      { productId: '3', quantity: 1, price: 350.00 }
    ],
    total: 600.00,
    createdAt: new Date('2024-01-20'),
    technician: 'Técnico João',
  },
  {
    id: '2',
    customerId: '2',
    products: [
      { productId: '2', quantity: 2, price: 180.00 }
    ],
    total: 360.00,
    createdAt: new Date('2024-01-22'),
    technician: 'Técnico Maria',
  },
  {
    id: '3',
    customerId: '3',
    products: [
      { productId: '4', quantity: 1, price: 320.00 },
      { productId: '3', quantity: 1, price: 350.00 }
    ],
    total: 670.00,
    createdAt: new Date('2024-01-28'),
    technician: 'Técnico João',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(demoServiceOrders);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [sales, setSales] = useState<Sale[]>(demoSales);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCustomers(prev => [...prev, newCustomer]);
    console.log('Cliente adicionado:', newCustomer);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => customer.id === id ? { ...customer, ...updates } : customer)
    );
    console.log('Cliente atualizado:', id, updates);
  };

  const removeCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    console.log('Cliente removido:', id);
  };

  const addServiceOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    const newOrder: ServiceOrder = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setServiceOrders(prev => [...prev, newOrder]);
  };

  const updateServiceOrder = (id: string, updates: Partial<ServiceOrder>) => {
    setServiceOrders(prev => 
      prev.map(order => order.id === id ? { ...order, ...updates } : order)
    );
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => product.id === id ? { ...product, ...updates } : product)
    );
    console.log('Produto atualizado no contexto:', id, updates);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    console.log('Produto removido do contexto:', id);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales(prev => [...prev, newSale]);

    // Update stock quantities
    saleData.products.forEach(({ productId, quantity }) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        updateProduct(productId, { 
          quantity: product.quantity - quantity 
        });
        
        // Add stock movement
        addStockMovement({
          productId,
          type: 'out',
          quantity,
          reason: `Venda OS #${newSale.id}`,
        });
      }
    });
  };

  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setStockMovements(prev => [...prev, newMovement]);
  };

  return (
    <DataContext.Provider value={{
      customers,
      serviceOrders,
      products,
      sales,
      stockMovements,
      addCustomer,
      updateCustomer,
      removeCustomer,
      addServiceOrder,
      updateServiceOrder,
      addProduct,
      updateProduct,
      removeProduct,
      addSale,
      addStockMovement,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
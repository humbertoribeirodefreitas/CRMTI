import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface SaleFormProps {
  onClose: () => void;
}

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

const SaleForm: React.FC<SaleFormProps> = ({ onClose }) => {
  const { customers, products, addSale } = useData();
  const [formData, setFormData] = useState({
    customerId: '',
    technician: '',
  });
  const [items, setItems] = useState<SaleItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Adicione pelo menos um produto à venda');
      return;
    }

    // Validate stock availability
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        alert('Produto não encontrado');
        return;
      }
      if (product.quantity < item.quantity) {
        alert(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
        return;
      }
    }

    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    addSale({
      customerId: formData.customerId,
      technician: formData.technician,
      products: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
    });
    
    onClose();
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productId: value as string,
          price: product.price,
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const getAvailableProducts = () => {
    return products.filter(product => product.quantity > 0);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Nova Venda</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Técnico</label>
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do técnico"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Produtos</h4>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum produto adicionado</p>
                <p className="text-sm">Clique em "Adicionar" para incluir produtos</p>
              </div>
            )}

            <div className="space-y-3">
              {items.map((item, index) => {
                const selectedProduct = products.find(p => p.id === item.productId);
                const maxQuantity = selectedProduct?.quantity || 0;
                
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {getAvailableProducts().map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.quantity})
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                      max={maxQuantity}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    
                    <span className="w-24 text-sm text-gray-600 text-right">
                      R$ {(item.quantity * item.price).toFixed(2)}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {items.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={items.length === 0 || !formData.customerId || !formData.technician}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
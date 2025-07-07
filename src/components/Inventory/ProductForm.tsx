import React, { useState } from 'react';
import { X, AlertCircle, Package, Tag, Hash, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ProductFormProps {
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onClose }) => {
  const { addProduct } = useData();
  const [formData, setFormData] = useState({
    name: '',
    type: 'physical' as 'physical' | 'virtual',
    category: '',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantidade não pode ser negativa';
    }
    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'Quantidade mínima não pode ser negativa';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addProduct(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const commonCategories = [
    'Storage',
    'Memory',
    'Graphics',
    'Processor',
    'Motherboard',
    'Power Supply',
    'Cooling',
    'Case',
    'Software',
    'Accessories',
    'Cables',
    'Tools'
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Novo Produto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Package className="w-4 h-4 inline mr-1" />
                Nome do Produto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: HD 1TB SATA"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Produto</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="physical">Físico</option>
                <option value="virtual">Virtual/Digital</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 inline mr-1" />
              Categoria *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              list="category-list"
              placeholder="Ex: Storage, Memory, Graphics..."
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <datalist id="category-list">
              {commonCategories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Hash className="w-4 h-4 inline mr-1" />
                Quantidade Atual
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade Mínima</label>
              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.minQuantity ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.minQuantity && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.minQuantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Preço (R$) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descrição técnica do produto, especificações, compatibilidade, etc..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {formData.quantity <= formData.minQuantity && formData.minQuantity > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-orange-800 font-medium">
                  Atenção: A quantidade atual está igual ou abaixo do estoque mínimo!
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Dicas para cadastro:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use nomes descritivos e específicos para facilitar a busca</li>
              <li>• A quantidade mínima ajuda a controlar o estoque</li>
              <li>• Produtos virtuais são licenças de software, serviços digitais, etc.</li>
              <li>• Mantenha a descrição atualizada com especificações técnicas</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cadastrar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
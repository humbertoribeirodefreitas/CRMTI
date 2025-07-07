import React, { useState } from 'react';
import { X, Key, Plus } from 'lucide-react';

interface PixKey {
  id: string;
  type: 'cpf' | 'email' | 'phone' | 'random';
  value: string;
  bankId: string;
}

interface Bank {
  id: string;
  name: string;
  pixKeys?: PixKey[];
}

interface PixFormProps {
  bank: Bank;
  onClose: () => void;
  onAddPixKey: (bankId: string, pixKey: Omit<PixKey, 'id' | 'bankId'>) => void;
}

const PixForm: React.FC<PixFormProps> = ({ bank, onClose, onAddPixKey }) => {
  const [formData, setFormData] = useState({
    type: 'email' as 'cpf' | 'email' | 'phone' | 'random',
    value: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let processedValue = formData.value;
    
    // Generate random key if type is random
    if (formData.type === 'random') {
      processedValue = generateRandomKey();
    }
    
    onAddPixKey(bank.id, {
      type: formData.type,
      value: processedValue,
    });
    
    setFormData({ type: 'email', value: '' });
  };

  const generateRandomKey = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleTypeChange = (type: 'cpf' | 'email' | 'phone' | 'random') => {
    setFormData({ type, value: type === 'random' ? '' : formData.value });
  };

  const getPlaceholder = () => {
    switch (formData.type) {
      case 'cpf':
        return '123.456.789-10';
      case 'email':
        return 'usuario@email.com';
      case 'phone':
        return '+5511999999999';
      case 'random':
        return 'Chave será gerada automaticamente';
      default:
        return '';
    }
  };

  const validateInput = () => {
    if (formData.type === 'random') return true;
    if (!formData.value.trim()) return false;
    
    switch (formData.type) {
      case 'cpf':
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.value);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value);
      case 'phone':
        return /^\+55\d{10,11}$/.test(formData.value);
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Gerenciar PIX - {bank.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Existing PIX Keys */}
        {bank.pixKeys && bank.pixKeys.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Chaves PIX Cadastradas</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {bank.pixKeys.map((key) => (
                <div key={key.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase">{key.type}</div>
                  <div className="text-sm font-mono">{key.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Chave PIX
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'cpf', label: 'CPF' },
                { value: 'email', label: 'E-mail' },
                { value: 'phone', label: 'Telefone' },
                { value: 'random', label: 'Aleatória' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value as any)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    formData.type === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {formData.type !== 'random' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor da Chave
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={getPlaceholder()}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.value && !validateInput() && (
                <p className="mt-1 text-sm text-red-600">
                  Formato inválido para o tipo de chave selecionado
                </p>
              )}
            </div>
          )}

          {formData.type === 'random' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Uma chave aleatória será gerada automaticamente pelo sistema.
              </p>
            </div>
          )}

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
              disabled={formData.type !== 'random' && !validateInput()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Chave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PixForm;
import React, { useState } from 'react';
import { X, Building, CreditCard, Smartphone } from 'lucide-react';

interface BankFormProps {
  onClose: () => void;
  onAddBank: (bank: any) => void;
}

const BankForm: React.FC<BankFormProps> = ({ onClose, onAddBank }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'traditional' as 'traditional' | 'digital' | 'payment',
    accountNumber: '',
    agency: '',
    balance: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBank = {
      ...formData,
      id: Date.now().toString(),
      icon: getIconForType(formData.type),
      color: getColorForType(formData.type),
      pixKeys: [],
    };
    
    onAddBank(newBank);
    onClose();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'traditional':
        return Building;
      case 'digital':
        return CreditCard;
      case 'payment':
        return Smartphone;
      default:
        return Building;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'traditional':
        return 'bg-blue-600';
      case 'digital':
        return 'bg-purple-600';
      case 'payment':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const bankOptions = [
    { value: 'traditional', label: 'Banco Tradicional', icon: Building },
    { value: 'digital', label: 'Banco Digital', icon: CreditCard },
    { value: 'payment', label: 'Meio de Pagamento', icon: Smartphone },
  ];

  const popularBanks = [
    'Banco do Brasil',
    'Caixa Econômica Federal',
    'Itaú',
    'Bradesco',
    'Santander',
    'Nubank',
    'Inter',
    'C6 Bank',
    'Mercado Pago',
    'PicPay',
    'PayPal',
    'Stone',
    'PagSeguro',
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Adicionar Banco</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Banco</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              list="popular-banks"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite ou selecione um banco"
            />
            <datalist id="popular-banks">
              {popularBanks.map((bank) => (
                <option key={bank} value={bank} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Instituição</label>
            <div className="grid grid-cols-1 gap-2">
              {bankOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={formData.type === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Icon className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {formData.type === 'traditional' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agência</label>
                <input
                  type="text"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Número da Conta</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345-6"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Saldo Inicial</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Adicionar Banco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankForm;
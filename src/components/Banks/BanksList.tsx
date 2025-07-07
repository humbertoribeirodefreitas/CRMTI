import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard, Building, Smartphone, Key, QrCode, Copy, Check } from 'lucide-react';
import BankForm from './BankForm';
import PixForm from './PixForm';
import QRCodeGenerator from './QRCodeGenerator';

interface PixKey {
  id: string;
  type: 'cpf' | 'email' | 'phone' | 'random';
  value: string;
  bankId: string;
}

interface Bank {
  id: string;
  name: string;
  type: 'traditional' | 'digital' | 'payment';
  accountNumber?: string;
  agency?: string;
  balance: number;
  status: 'active' | 'inactive';
  icon: React.ComponentType<any>;
  color: string;
  pixKeys?: PixKey[];
}

const BanksList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPixForm, setShowPixForm] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [banks, setBanks] = useState<Bank[]>([
    {
      id: '1',
      name: 'Mercado Pago',
      type: 'payment',
      balance: 15420.50,
      status: 'active',
      icon: CreditCard,
      color: 'bg-blue-500',
      pixKeys: [
        { id: '1', type: 'email', value: 'humberto@mercadopago.com', bankId: '1' },
        { id: '2', type: 'phone', value: '+5511987654321', bankId: '1' }
      ]
    },
    {
      id: '2',
      name: 'Caixa Econômica Federal',
      type: 'traditional',
      accountNumber: '12345-6',
      agency: '1234',
      balance: 25680.75,
      status: 'active',
      icon: Building,
      color: 'bg-blue-800',
      pixKeys: [
        { id: '3', type: 'cpf', value: '123.456.789-10', bankId: '2' }
      ]
    },
    {
      id: '3',
      name: 'Santander',
      type: 'traditional',
      accountNumber: '98765-4',
      agency: '5678',
      balance: 18950.30,
      status: 'active',
      icon: Building,
      color: 'bg-red-600',
      pixKeys: [
        { id: '6', type: 'email', value: 'humberto.santos@santander.com.br', bankId: '3' }
      ]
    },
    {
      id: '4',
      name: 'Nubank',
      type: 'digital',
      balance: 8750.20,
      status: 'active',
      icon: CreditCard,
      color: 'bg-purple-600',
      pixKeys: [
        { id: '4', type: 'random', value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', bankId: '4' }
      ]
    },
    {
      id: '5',
      name: 'PicPay',
      type: 'payment',
      balance: 3240.80,
      status: 'active',
      icon: Smartphone,
      color: 'bg-green-500',
      pixKeys: [
        { id: '5', type: 'email', value: 'humberto@picpay.com', bankId: '5' }
      ]
    },
    {
      id: '6',
      name: 'Banco do Brasil',
      type: 'traditional',
      accountNumber: '54321-0',
      agency: '9876',
      balance: 42150.90,
      status: 'active',
      icon: Building,
      color: 'bg-yellow-600',
      pixKeys: [
        { id: '7', type: 'cpf', value: '987.654.321-00', bankId: '6' },
        { id: '8', type: 'phone', value: '+5511912345678', bankId: '6' }
      ]
    },
    {
      id: '7',
      name: 'Inter',
      type: 'digital',
      balance: 12890.45,
      status: 'active',
      icon: CreditCard,
      color: 'bg-orange-500',
      pixKeys: [
        { id: '9', type: 'email', value: 'humberto.inter@bancointer.com.br', bankId: '7' },
        { id: '10', type: 'random', value: 'f9e8d7c6-b5a4-3210-9876-543210fedcba', bankId: '7' }
      ]
    },
    {
      id: '8',
      name: 'C6 Bank',
      type: 'digital',
      balance: 6780.25,
      status: 'active',
      icon: CreditCard,
      color: 'bg-gray-700',
      pixKeys: [
        { id: '11', type: 'phone', value: '+5511876543210', bankId: '8' }
      ]
    },
    {
      id: '9',
      name: 'Itaú',
      type: 'traditional',
      accountNumber: '11111-1',
      agency: '0001',
      balance: 35420.60,
      status: 'active',
      icon: Building,
      color: 'bg-orange-600',
      pixKeys: [
        { id: '12', type: 'cpf', value: '111.222.333-44', bankId: '9' },
        { id: '13', type: 'email', value: 'humberto@itau.com.br', bankId: '9' }
      ]
    },
    {
      id: '10',
      name: 'PayPal',
      type: 'payment',
      balance: 2150.75,
      status: 'active',
      icon: Smartphone,
      color: 'bg-blue-400',
      pixKeys: [
        { id: '14', type: 'email', value: 'humberto@paypal.com', bankId: '10' }
      ]
    },
    {
      id: '11',
      name: 'Bradesco',
      type: 'traditional',
      accountNumber: '77777-7',
      agency: '7777',
      balance: 28950.40,
      status: 'inactive',
      icon: Building,
      color: 'bg-red-700',
      pixKeys: [
        { id: '15', type: 'cpf', value: '555.666.777-88', bankId: '11' }
      ]
    },
    {
      id: '12',
      name: 'Stone',
      type: 'payment',
      balance: 5680.30,
      status: 'active',
      icon: Smartphone,
      color: 'bg-green-700',
      pixKeys: [
        { id: '16', type: 'email', value: 'humberto@stone.com.br', bankId: '12' },
        { id: '17', type: 'phone', value: '+5511765432109', bankId: '12' }
      ]
    }
  ]);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalBalance = () => {
    return banks.reduce((total, bank) => total + bank.balance, 0);
  };

  const getBankTypeLabel = (type: string) => {
    switch (type) {
      case 'traditional':
        return 'Tradicional';
      case 'digital':
        return 'Digital';
      case 'payment':
        return 'Pagamento';
      default:
        return type;
    }
  };

  const getPixTypeLabel = (type: string) => {
    switch (type) {
      case 'cpf':
        return 'CPF';
      case 'email':
        return 'E-mail';
      case 'phone':
        return 'Telefone';
      case 'random':
        return 'Chave Aleatória';
      default:
        return type;
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleAddBank = (newBank: Bank) => {
    setBanks(prevBanks => [...prevBanks, newBank]);
  };

  const handleAddPixKey = (bankId: string, pixKey: Omit<PixKey, 'id' | 'bankId'>) => {
    setBanks(prevBanks => 
      prevBanks.map(bank => 
        bank.id === bankId 
          ? {
              ...bank,
              pixKeys: [
                ...(bank.pixKeys || []),
                {
                  ...pixKey,
                  id: Date.now().toString(),
                  bankId
                }
              ]
            }
          : bank
      )
    );
  };

  const handleRemovePixKey = (bankId: string, keyId: string) => {
    setBanks(prevBanks => 
      prevBanks.map(bank => 
        bank.id === bankId 
          ? {
              ...bank,
              pixKeys: bank.pixKeys?.filter(key => key.id !== keyId) || []
            }
          : bank
      )
    );
  };

  const handleRemoveBank = (bankId: string) => {
    setBanks(prevBanks => prevBanks.filter(bank => bank.id !== bankId));
  };

  const openPixForm = (bank: Bank) => {
    setSelectedBank(bank);
    setShowPixForm(true);
  };

  const openQRGenerator = (bank: Bank) => {
    setSelectedBank(bank);
    setShowQRGenerator(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bancos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie suas contas bancárias, chaves PIX e gere QR codes para pagamentos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Banco</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {getTotalBalance().toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Distribuído em {banks.length} contas</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{banks.filter(b => b.status === 'active').length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {banks.filter(b => b.status === 'inactive').length} inativas
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bancos Digitais</p>
              <p className="text-2xl font-bold text-gray-900">{banks.filter(b => b.type === 'digital' || b.type === 'payment').length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {banks.filter(b => b.type === 'traditional').length} tradicionais
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chaves PIX</p>
              <p className="text-2xl font-bold text-gray-900">
                {banks.reduce((total, bank) => total + (bank.pixKeys?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-full">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              Prontas para recebimentos
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar bancos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {filteredBanks.map((bank) => {
            const Icon = bank.icon;
            return (
              <div key={bank.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${bank.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openPixForm(bank)}
                      className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                      title="Gerenciar PIX"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openQRGenerator(bank)}
                      className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50"
                      title="Gerar QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveBank(bank.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{bank.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{getBankTypeLabel(bank.type)}</span>
                  </div>
                  
                  {bank.accountNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conta:</span>
                      <span className="font-medium">{bank.accountNumber}</span>
                    </div>
                  )}
                  
                  {bank.agency && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Agência:</span>
                      <span className="font-medium">{bank.agency}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      bank.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bank.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* PIX Keys Section */}
                {bank.pixKeys && bank.pixKeys.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Key className="w-4 h-4 mr-1" />
                      Chaves PIX ({bank.pixKeys.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bank.pixKeys.map((pixKey) => (
                        <div key={pixKey.id} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500">{getPixTypeLabel(pixKey.type)}</div>
                            <div className="text-sm font-mono truncate">{pixKey.value}</div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => copyToClipboard(pixKey.value, pixKey.id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Copiar chave"
                            >
                              {copiedKey === pixKey.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRemovePixKey(bank.id, pixKey.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Remover chave"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saldo:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {bank.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <BankForm
          onClose={() => setShowForm(false)}
          onAddBank={handleAddBank}
        />
      )}

      {showPixForm && selectedBank && (
        <PixForm
          bank={selectedBank}
          onClose={() => {
            setShowPixForm(false);
            setSelectedBank(null);
          }}
          onAddPixKey={handleAddPixKey}
        />
      )}

      {showQRGenerator && selectedBank && (
        <QRCodeGenerator
          bank={selectedBank}
          onClose={() => {
            setShowQRGenerator(false);
            setSelectedBank(null);
          }}
        />
      )}
    </div>
  );
};

export default BanksList;
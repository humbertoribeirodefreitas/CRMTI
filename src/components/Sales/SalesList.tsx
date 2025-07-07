import React, { useState } from 'react';
import { Plus, Search, Eye, FileText, User, DollarSign, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import SaleForm from './SaleForm';
import SaleView from './SaleView';

const SalesList: React.FC = () => {
  const { sales, customers, products } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(sale => {
    const customer = customers.find(c => c.id === sale.customerId);
    return (
      sale.id.includes(searchTerm) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.technician.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getAverageTicket = () => {
    return sales.length > 0 ? getTotalSales() / sales.length : 0;
  };

  const handleViewSale = (sale: any) => {
    console.log('Visualizando venda:', sale);
    setSelectedSale(sale);
    setShowView(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie todas as vendas realizadas no sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Vendas realizadas</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {getTotalSales().toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Receita acumulada</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {getAverageTicket().toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Valor médio por venda</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">#{sale.id}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">Venda #{sale.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer?.name}</div>
                      <div className="text-sm text-gray-500">{customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.technician}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {sale.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.products.length} item{sale.products.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleViewSale(sale);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar venda"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Tente ajustar os filtros de pesquisa'
                : 'Registre sua primeira venda clicando no botão "Nova Venda"'
              }
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <SaleForm onClose={() => setShowForm(false)} />
      )}

      {showView && selectedSale && (
        <SaleView
          sale={selectedSale}
          onClose={() => {
            setShowView(false);
            setSelectedSale(null);
          }}
        />
      )}
    </div>
  );
};

export default SalesList;
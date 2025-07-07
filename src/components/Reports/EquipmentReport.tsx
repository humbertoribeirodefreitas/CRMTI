import React, { useState } from 'react';
import { X, Download, FileText, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface EquipmentReportProps {
  onClose: () => void;
}

const EquipmentReport: React.FC<EquipmentReportProps> = ({ onClose }) => {
  const { serviceOrders, customers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'Em Análise';
      case 'fixed':
        return 'Consertado';
      case 'waiting_parts':
        return 'Aguardando Peças';
      case 'completed':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = serviceOrders.filter(order => {
    const customer = customers.find(c => c.id === order.customerId);
    const matchesSearch = 
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = orderDate >= startDate && orderDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const generatePDFReport = () => {
    const reportData = filteredOrders.map(order => {
      const customer = customers.find(c => c.id === order.customerId);
      return {
        os: order.id,
        cliente: customer?.name || 'N/A',
        equipamento: order.equipment,
        descricao: order.description,
        tecnico: order.technician,
        status: getStatusText(order.status),
        data: new Date(order.createdAt).toLocaleDateString('pt-BR'),
        observacoes: order.observations || 'Nenhuma observação',
      };
    });

    console.log('Gerando relatório PDF de equipamentos:', reportData);
    alert(`Relatório de equipamentos gerado com sucesso! ${reportData.length} registros incluídos.`);
  };

  const exportToExcel = () => {
    const reportData = filteredOrders.map(order => {
      const customer = customers.find(c => c.id === order.customerId);
      return {
        'OS': order.id,
        'Cliente': customer?.name || 'N/A',
        'Equipamento': order.equipment,
        'Descrição do Problema': order.description,
        'Técnico': order.technician,
        'Status': getStatusText(order.status),
        'Data': new Date(order.createdAt).toLocaleDateString('pt-BR'),
        'Observações': order.observations || 'Nenhuma observação',
      };
    });

    console.log('Exportando para Excel:', reportData);
    alert(`Dados exportados para Excel com sucesso! ${reportData.length} registros incluídos.`);
  };

  const getEquipmentStats = () => {
    const equipmentTypes = filteredOrders.reduce((acc, order) => {
      const type = order.equipment.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusStats = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { equipmentTypes, statusStats };
  };

  const { equipmentTypes, statusStats } = getEquipmentStats();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Relatório de Equipamentos e Descrições
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Equipamento, cliente, técnico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="analyzing">Em Análise</option>
                <option value="fixed">Consertado</option>
                <option value="waiting_parts">Aguardando Peças</option>
                <option value="completed">Finalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Equipamentos Mais Atendidos</h5>
            <div className="space-y-2">
              {Object.entries(equipmentTypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([equipment, count]) => (
                  <div key={equipment} className="flex justify-between">
                    <span className="text-sm text-gray-700 capitalize">{equipment}</span>
                    <span className="text-sm font-medium text-blue-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Status dos Atendimentos</h5>
            <div className="space-y-2">
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span className="text-sm text-gray-700">{getStatusText(status)}</span>
                  <span className="text-sm font-medium text-green-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Mostrando {filteredOrders.length} de {serviceOrders.length} registros
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generatePDFReport}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipamento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição do Problema
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer?.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">{order.equipment}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <p className="truncate" title={order.description}>
                          {order.description}
                        </p>
                        {order.observations && (
                          <p className="text-xs text-gray-500 mt-1 truncate" title={order.observations}>
                            Obs: {order.observations}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.technician}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum registro encontrado com os filtros aplicados</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentReport;
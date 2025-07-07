import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Filter, Calendar, User, Wrench } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ServiceOrderForm from './ServiceOrderForm';
import ServiceOrderView from './ServiceOrderView';

const ServiceOrderList: React.FC = () => {
  const { serviceOrders, customers, updateServiceOrder } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');

  const filteredOrders = serviceOrders.filter(order => {
    const customer = customers.find(c => c.id === order.customerId);
    const matchesSearch = 
      order.id.includes(searchTerm) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTechnician = technicianFilter === 'all' || order.technician === technicianFilter;
    
    return matchesSearch && matchesStatus && matchesTechnician;
  });

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

  const getPriorityColor = (createdAt: Date) => {
    const daysDiff = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 7) return 'border-l-red-500';
    if (daysDiff > 3) return 'border-l-orange-500';
    return 'border-l-green-500';
  };

  const getUniqueTechnicians = () => {
    const technicians = [...new Set(serviceOrders.map(order => order.technician))];
    return technicians.sort();
  };

  const getOrderStats = () => {
    const total = filteredOrders.length;
    const analyzing = filteredOrders.filter(o => o.status === 'analyzing').length;
    const inProgress = filteredOrders.filter(o => o.status === 'fixed' || o.status === 'waiting_parts').length;
    const completed = filteredOrders.filter(o => o.status === 'completed').length;
    
    return { total, analyzing, inProgress, completed };
  };

  const stats = getOrderStats();

  const handleViewOrder = (order: any) => {
    console.log('Visualizando ordem:', order);
    setSelectedOrder(order);
    setShowView(true);
  };

  const handleEditOrder = (order: any) => {
    console.log('Editando ordem:', order);
    // Por enquanto, vamos abrir a visualização em modo de edição
    setSelectedOrder(order);
    setShowView(true);
  };

  const handleUpdateOrder = (orderId: string, updates: any) => {
    updateServiceOrder(orderId, updates);
    // Update the selected order if it's currently being viewed
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, ...updates });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ordens de Serviço</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie e acompanhe todas as ordens de serviço
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova OS</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de OS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Análise</p>
              <p className="text-2xl font-bold text-gray-900">{stats.analyzing}</p>
            </div>
            <Search className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
            <Wrench className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Finalizadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar OS, cliente, equipamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="analyzing">Em Análise</option>
              <option value="fixed">Consertado</option>
              <option value="waiting_parts">Aguardando Peças</option>
              <option value="completed">Finalizado</option>
            </select>

            <select
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Técnicos</option>
              {getUniqueTechnicians().map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Mostrando {filteredOrders.length} de {serviceOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const customer = customers.find(c => c.id === order.customerId);
            const daysSinceCreated = Math.floor((new Date().getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={order.id} 
                className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(order.createdAt)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        OS #{order.id}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {daysSinceCreated > 7 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Urgente
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{customer?.name || 'Cliente não encontrado'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4" />
                        <span>{order.equipment}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{order.createdAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {order.description}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Técnico: {order.technician}</span>
                        <span>•</span>
                        <span>Há {daysSinceCreated} dia{daysSinceCreated !== 1 ? 's' : ''}</span>
                        {order.usedParts.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{order.usedParts.length} peça{order.usedParts.length !== 1 ? 's' : ''} utilizada{order.usedParts.length !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Visualizar OS"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditOrder(order);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Editar OS"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma OS encontrada</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || technicianFilter !== 'all'
                ? 'Tente ajustar os filtros de pesquisa'
                : 'Crie sua primeira ordem de serviço clicando no botão "Nova OS"'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ServiceOrderForm onClose={() => setShowForm(false)} />
      )}

      {showView && selectedOrder && (
        <ServiceOrderView
          order={selectedOrder}
          onClose={() => {
            setShowView(false);
            setSelectedOrder(null);
          }}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default ServiceOrderList;
import React, { useState } from 'react';
import { X, Edit, Save, Ambulance as Cancel, Clock, User, Wrench, Package, FileText, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ServiceOrder {
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

interface ServiceOrderViewProps {
  order: ServiceOrder;
  onClose: () => void;
  onUpdate: (orderId: string, updates: Partial<ServiceOrder>) => void;
}

const ServiceOrderView: React.FC<ServiceOrderViewProps> = ({ order, onClose, onUpdate }) => {
  const { customers, products } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: order.status,
    technician: order.technician,
    observations: order.observations,
    description: order.description,
    equipment: order.equipment,
  });
  const [newPart, setNewPart] = useState('');
  const [showAddPart, setShowAddPart] = useState(false);

  const customer = customers.find(c => c.id === order.customerId);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'analyzing':
        return {
          text: 'Em Análise',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          description: 'Ordem de serviço está sendo analisada'
        };
      case 'fixed':
        return {
          text: 'Consertado',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          description: 'Equipamento foi consertado com sucesso'
        };
      case 'waiting_parts':
        return {
          text: 'Aguardando Peças',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Package,
          description: 'Aguardando chegada de peças para reparo'
        };
      case 'completed':
        return {
          text: 'Finalizado',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle,
          description: 'Ordem de serviço finalizada e entregue'
        };
      default:
        return {
          text: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          description: 'Status desconhecido'
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const handleSave = () => {
    onUpdate(order.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      status: order.status,
      technician: order.technician,
      observations: order.observations,
      description: order.description,
      equipment: order.equipment,
    });
    setIsEditing(false);
  };

  const handleAddPart = () => {
    if (newPart.trim()) {
      const updatedParts = [...order.usedParts, newPart.trim()];
      onUpdate(order.id, { usedParts: updatedParts });
      setNewPart('');
      setShowAddPart(false);
    }
  };

  const handleRemovePart = (partIndex: number) => {
    const updatedParts = order.usedParts.filter((_, index) => index !== partIndex);
    onUpdate(order.id, { usedParts: updatedParts });
  };

  const getUsedPartsDetails = () => {
    return order.usedParts.map(partId => {
      const product = products.find(p => p.id === partId);
      return {
        id: partId,
        name: product?.name || `Peça ID: ${partId}`,
        category: product?.category || 'N/A',
        price: product?.price || 0,
      };
    });
  };

  const getTotalPartsValue = () => {
    return getUsedPartsDetails().reduce((total, part) => total + part.price, 0);
  };

  const getTimelineEvents = () => {
    const events = [
      {
        date: order.createdAt,
        title: 'OS Criada',
        description: `Ordem de serviço criada por ${order.technician}`,
        icon: FileText,
        color: 'bg-blue-500'
      }
    ];

    // Add status change events (simulated)
    if (order.status !== 'analyzing') {
      events.push({
        date: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000), // +1 day
        title: 'Diagnóstico Realizado',
        description: 'Análise inicial do equipamento concluída',
        icon: Wrench,
        color: 'bg-yellow-500'
      });
    }

    if (order.status === 'completed') {
      events.push({
        date: new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        title: 'Serviço Finalizado',
        description: 'Equipamento reparado e pronto para entrega',
        icon: CheckCircle,
        color: 'bg-green-500'
      });
    }

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ordem de Serviço #{order.id}</h2>
              <p className="text-sm text-gray-600">
                Criada em {order.createdAt.toLocaleDateString('pt-BR')} às {order.createdAt.toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full border ${statusInfo.color} flex items-center space-x-2`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{statusInfo.text}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Cancel className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.cpf || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  Detalhes do Serviço
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Equipamento</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.equipment}
                        onChange={(e) => setEditData({ ...editData, equipment: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{order.equipment}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição do Problema</label>
                    {isEditing ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{order.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Técnico Responsável</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.technician}
                          onChange={(e) => setEditData({ ...editData, technician: e.target.value })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{order.technician}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      {isEditing ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="analyzing">Em Análise</option>
                          <option value="fixed">Consertado</option>
                          <option value="waiting_parts">Aguardando Peças</option>
                          <option value="completed">Finalizado</option>
                        </select>
                      ) : (
                        <div className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                    {isEditing ? (
                      <textarea
                        value={editData.observations}
                        onChange={(e) => setEditData({ ...editData, observations: e.target.value })}
                        rows={3}
                        placeholder="Adicione observações sobre o serviço..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{order.observations || 'Nenhuma observação'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Used Parts */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Peças Utilizadas
                  </h3>
                  <button
                    onClick={() => setShowAddPart(true)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Peça</span>
                  </button>
                </div>

                {showAddPart && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex space-x-2">
                      <select
                        value={newPart}
                        onChange={(e) => setNewPart(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione uma peça</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - R$ {product.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddPart}
                        disabled={!newPart}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => {
                          setShowAddPart(false);
                          setNewPart('');
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {getUsedPartsDetails().map((part, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{part.name}</p>
                        <p className="text-sm text-gray-600">{part.category}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          R$ {part.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemovePart(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {order.usedParts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma peça utilizada ainda</p>
                    </div>
                  )}
                  
                  {order.usedParts.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total em Peças:</span>
                        <span className="text-lg font-bold text-green-600">
                          R$ {getTotalPartsValue().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status Atual</h3>
                <div className={`p-4 rounded-lg border ${statusInfo.color}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusIcon className="w-6 h-6" />
                    <span className="font-medium">{statusInfo.text}</span>
                  </div>
                  <p className="text-sm">{statusInfo.description}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico</h3>
                <div className="space-y-4">
                  {getTimelineEvents().map((event, index) => {
                    const EventIcon = event.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`${event.color} p-2 rounded-full`}>
                          <EventIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {event.date.toLocaleDateString('pt-BR')} às {event.date.toLocaleTimeString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📞 Ligar para o cliente
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📧 Enviar email
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📄 Gerar orçamento
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    🖨️ Imprimir OS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderView;
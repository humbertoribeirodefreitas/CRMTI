import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ServiceOrderFormProps {
  onClose: () => void;
}

const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onClose }) => {
  const { customers, addServiceOrder } = useData();
  const [formData, setFormData] = useState({
    customerId: '',
    description: '',
    equipment: '',
    technician: '',
    observations: '',
    status: 'analyzing' as 'analyzing' | 'fixed' | 'waiting_parts' | 'completed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Selecione um cliente';
    }
    if (!formData.equipment.trim()) {
      newErrors.equipment = 'Informe o equipamento';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descreva o problema';
    }
    if (!formData.technician.trim()) {
      newErrors.technician = 'Informe o técnico responsável';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addServiceOrder({
      ...formData,
      usedParts: [],
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const commonEquipments = [
    'Desktop',
    'Notebook',
    'Impressora',
    'Monitor',
    'Smartphone',
    'Tablet',
    'Roteador',
    'Switch',
    'Servidor',
    'All-in-One'
  ];

  const commonTechnicians = [
    'Técnico João',
    'Técnico Maria',
    'Técnico Carlos',
    'Técnico Ana'
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Nova Ordem de Serviço</h3>
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
              <label className="block text-sm font-medium text-gray-700">Cliente *</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customerId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Equipamento *</label>
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                list="equipment-list"
                placeholder="Ex: Desktop Dell, Notebook HP..."
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.equipment ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <datalist id="equipment-list">
                {commonEquipments.map(equipment => (
                  <option key={equipment} value={equipment} />
                ))}
              </datalist>
              {errors.equipment && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.equipment}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição do Problema *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Técnico Responsável *</label>
              <input
                type="text"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                list="technician-list"
                placeholder="Nome do técnico"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.technician ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <datalist id="technician-list">
                {commonTechnicians.map(tech => (
                  <option key={tech} value={tech} />
                ))}
              </datalist>
              {errors.technician && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.technician}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status Inicial</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="analyzing">Em Análise</option>
                <option value="fixed">Consertado</option>
                <option value="waiting_parts">Aguardando Peças</option>
                <option value="completed">Finalizado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={3}
              placeholder="Observações adicionais, diagnóstico inicial, etc..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Dicas para preenchimento:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Seja específico na descrição do problema</li>
              <li>• Inclua informações sobre quando o problema começou</li>
              <li>• Mencione se há mensagens de erro específicas</li>
              <li>• Anote o modelo e marca do equipamento quando possível</li>
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
              Criar Ordem de Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderForm;
import React from 'react';
import { X, User, Calendar, Package, DollarSign, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Sale {
  id: string;
  customerId: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  createdAt: Date;
  technician: string;
}

interface SaleViewProps {
  sale: Sale;
  onClose: () => void;
}

const SaleView: React.FC<SaleViewProps> = ({ sale, onClose }) => {
  const { customers, products } = useData();
  
  const customer = customers.find(c => c.id === sale.customerId);

  const getSaleProducts = () => {
    return sale.products.map(saleProduct => {
      const product = products.find(p => p.id === saleProduct.productId);
      return {
        ...saleProduct,
        name: product?.name || 'Produto não encontrado',
        category: product?.category || 'N/A',
        subtotal: saleProduct.quantity * saleProduct.price,
      };
    });
  };

  const saleProducts = getSaleProducts();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Venda #{sale.id}</h2>
              <p className="text-sm text-gray-600">
                Realizada em {new Date(sale.createdAt).toLocaleDateString('pt-BR')} às {new Date(sale.createdAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.cpf || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.email || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <p className="mt-1 text-sm text-gray-900">{customer?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Produtos Vendidos
                </h3>
                <div className="space-y-3">
                  {saleProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm text-gray-500">
                          Quantidade: {product.quantity} × R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          R$ {product.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sale Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Resumo da Venda
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {sale.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Desconto:</span>
                    <span className="text-sm font-medium text-gray-900">R$ 0,00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {sale.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Detalhes da Venda
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Técnico Responsável</label>
                    <p className="mt-1 text-sm text-gray-900">{sale.technician}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data da Venda</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Horário</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(sale.createdAt).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Itens Vendidos</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {sale.products.reduce((total, product) => total + product.quantity, 0)} unidades
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    🖨️ Imprimir Recibo
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📧 Enviar por Email
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📄 Gerar PDF
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    📞 Contatar Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleView;
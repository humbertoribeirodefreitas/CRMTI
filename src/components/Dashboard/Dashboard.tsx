import React from 'react';
import { Users, ClipboardList, Package, TrendingUp, AlertTriangle, Wrench, ShoppingCart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { customers, serviceOrders, products, sales } = useData();

  const stats = [
    {
      title: 'Total de Clientes',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      description: 'Clientes cadastrados',
    },
    {
      title: 'Ordens de Serviço',
      value: serviceOrders.length,
      icon: ClipboardList,
      color: 'bg-green-500',
      change: '+8%',
      description: 'Total de OS abertas',
    },
    {
      title: 'Produtos em Estoque',
      value: products.length,
      icon: Package,
      color: 'bg-purple-500',
      change: '+3%',
      description: 'Itens cadastrados',
    },
    {
      title: 'Vendas Realizadas',
      value: sales.length,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      change: '+15%',
      description: 'Vendas do período',
    },
  ];

  const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);
  const pendingOrders = serviceOrders.filter(o => o.status !== 'completed');
  const recentSales = sales.slice(-5).reverse();

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo ao CRM Técnico</h1>
        <p className="text-blue-100">
          Sistema completo de gestão de suporte técnico e controle de estoque
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Faturamento Total
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              R$ {getTotalRevenue().toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Baseado em {sales.length} vendas realizadas
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Ticket Médio</p>
            <p className="text-xl font-semibold text-gray-900">
              R$ {sales.length > 0 ? (getTotalRevenue() / sales.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Service Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-blue-500" />
            Ordens de Serviço Pendentes
          </h3>
          <div className="space-y-3">
            {pendingOrders.slice(0, 5).map((order) => {
              const customer = customers.find(c => c.id === order.customerId);
              return (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">OS #{order.id}</p>
                    <p className="text-sm text-gray-600">{customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.equipment}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'waiting_parts' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              );
            })}
            {pendingOrders.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma OS pendente</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Produtos com Estoque Baixo
          </h3>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{product.quantity} unidades</p>
                  <p className="text-xs text-gray-500">Mín: {product.minQuantity}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Estoque em níveis normais</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
            Vendas Recentes
          </h3>
          <div className="space-y-3">
            {recentSales.map((sale) => {
              const customer = customers.find(c => c.id === sale.customerId);
              return (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Venda #{sale.id}</p>
                    <p className="text-sm text-gray-600">{customer?.name}</p>
                    <p className="text-xs text-gray-500">{sale.technician}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">R$ {sale.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentSales.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma venda recente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
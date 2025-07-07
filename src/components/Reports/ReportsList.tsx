import React, { useState } from 'react';
import { Download, FileText, TrendingUp, Users, Package, Wrench } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import EquipmentReport from './EquipmentReport';
import ExportModal from './ExportModal';
import { ExportData, formatCurrencyForExport, formatDateForExport } from '../../utils/exportUtils';

const ReportsList: React.FC = () => {
  const { sales, customers, products, serviceOrders } = useData();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showEquipmentReport, setShowEquipmentReport] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [exportTitle, setExportTitle] = useState('');

  const generateSalesReport = () => {
    const reportData = sales.map(sale => {
      const customer = customers.find(c => c.id === sale.customerId);
      return {
        id: sale.id,
        cliente: customer?.name || 'N/A',
        tecnico: sale.technician,
        total: sale.total,
        data: formatDateForExport(new Date(sale.createdAt)),
        produtos: sale.products.map(p => {
          const product = products.find(prod => prod.id === p.productId);
          return `${product?.name || 'N/A'} (${p.quantity}x)`;
        }).join(', '),
      };
    });

    const exportData: ExportData = {
      headers: ['ID', 'Cliente', 'Técnico', 'Total (R$)', 'Data', 'Produtos'],
      rows: reportData.map(sale => [
        sale.id,
        sale.cliente,
        sale.tecnico,
        formatCurrencyForExport(sale.total),
        sale.data,
        sale.produtos
      ]),
      filename: `relatorio-vendas-${new Date().toISOString().split('T')[0]}`
    };

    setExportData(exportData);
    setExportTitle('Relatório de Vendas');
    setShowExportModal(true);
  };

  const generateTechnicianReport = () => {
    const technicianStats = serviceOrders.reduce((acc, order) => {
      const tech = order.technician;
      if (!acc[tech]) {
        acc[tech] = { 
          ordens: 0, 
          finalizadas: 0, 
          pecasUsadas: [],
          equipamentos: []
        };
      }
      acc[tech].ordens++;
      if (order.status === 'completed') {
        acc[tech].finalizadas++;
      }
      acc[tech].pecasUsadas.push(...order.usedParts);
      acc[tech].equipamentos.push(order.equipment);
      return acc;
    }, {} as Record<string, { 
      ordens: number; 
      finalizadas: number; 
      pecasUsadas: string[];
      equipamentos: string[];
    }>);

    const exportData: ExportData = {
      headers: ['Técnico', 'Total de OS', 'OS Finalizadas', 'Taxa de Conclusão (%)', 'Peças Utilizadas', 'Equipamentos Atendidos'],
      rows: Object.entries(technicianStats).map(([tech, stats]) => [
        tech,
        stats.ordens,
        stats.finalizadas,
        ((stats.finalizadas / stats.ordens) * 100).toFixed(1),
        stats.pecasUsadas.length,
        [...new Set(stats.equipamentos)].length
      ]),
      filename: `relatorio-tecnicos-${new Date().toISOString().split('T')[0]}`
    };

    setExportData(exportData);
    setExportTitle('Relatório por Técnico');
    setShowExportModal(true);
  };

  const generateInventoryReport = () => {
    const inventoryData = products.map(product => ({
      nome: product.name,
      categoria: product.category,
      tipo: product.type === 'physical' ? 'Físico' : 'Virtual',
      quantidade: product.quantity,
      quantidadeMinima: product.minQuantity,
      preco: product.price,
      status: product.quantity <= product.minQuantity ? 'Estoque Baixo' : 'Normal',
      valorTotal: product.quantity * product.price,
    }));

    const exportData: ExportData = {
      headers: ['Nome', 'Categoria', 'Tipo', 'Quantidade', 'Qtd. Mínima', 'Preço (R$)', 'Status', 'Valor Total (R$)'],
      rows: inventoryData.map(product => [
        product.nome,
        product.categoria,
        product.tipo,
        product.quantidade,
        product.quantidadeMinima,
        formatCurrencyForExport(product.preco),
        product.status,
        formatCurrencyForExport(product.valorTotal)
      ]),
      filename: `relatorio-estoque-${new Date().toISOString().split('T')[0]}`
    };

    setExportData(exportData);
    setExportTitle('Relatório de Estoque');
    setShowExportModal(true);
  };

  const generateCustomersReport = () => {
    const customersData = customers.map(customer => ({
      nome: customer.name,
      cpf: customer.cpf,
      telefone: customer.phone,
      email: customer.email,
      endereco: customer.address,
      tipoServico: customer.serviceType === 'maintenance' ? 'Manutenção' : 'Troca',
      dataCadastro: formatDateForExport(new Date(customer.createdAt))
    }));

    const exportData: ExportData = {
      headers: ['Nome', 'CPF', 'Telefone', 'Email', 'Endereço', 'Tipo de Serviço', 'Data de Cadastro'],
      rows: customersData.map(customer => [
        customer.nome,
        customer.cpf,
        customer.telefone,
        customer.email,
        customer.endereco,
        customer.tipoServico,
        customer.dataCadastro
      ]),
      filename: `relatorio-clientes-${new Date().toISOString().split('T')[0]}`
    };

    setExportData(exportData);
    setExportTitle('Relatório de Clientes');
    setShowExportModal(true);
  };

  const exportAllData = () => {
    // Combine all data into a comprehensive report
    const allData = [
      ['=== RELATÓRIO COMPLETO DO SISTEMA ==='],
      [''],
      ['=== VENDAS ==='],
      ['ID', 'Cliente', 'Técnico', 'Total (R$)', 'Data'],
      ...sales.map(sale => {
        const customer = customers.find(c => c.id === sale.customerId);
        return [
          sale.id,
          customer?.name || 'N/A',
          sale.technician,
          formatCurrencyForExport(sale.total),
          formatDateForExport(new Date(sale.createdAt))
        ];
      }),
      [''],
      ['=== CLIENTES ==='],
      ['Nome', 'CPF', 'Telefone', 'Email', 'Tipo de Serviço'],
      ...customers.map(customer => [
        customer.name,
        customer.cpf,
        customer.phone,
        customer.email,
        customer.serviceType === 'maintenance' ? 'Manutenção' : 'Troca'
      ]),
      [''],
      ['=== ESTOQUE ==='],
      ['Nome', 'Categoria', 'Quantidade', 'Preço (R$)', 'Status'],
      ...products.map(product => [
        product.name,
        product.category,
        product.quantity,
        formatCurrencyForExport(product.price),
        product.quantity <= product.minQuantity ? 'Estoque Baixo' : 'Normal'
      ])
    ];

    const exportData: ExportData = {
      headers: [],
      rows: allData,
      filename: `relatorio-completo-${new Date().toISOString().split('T')[0]}`
    };

    setExportData(exportData);
    setExportTitle('Relatório Completo');
    setShowExportModal(true);
  };

  const getSalesMetrics = () => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const avgTicket = sales.length > 0 ? totalSales / sales.length : 0;
    const totalOrders = serviceOrders.length;
    const completedOrders = serviceOrders.filter(o => o.status === 'completed').length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      totalSales,
      avgTicket,
      totalOrders,
      completedOrders,
      completionRate,
    };
  };

  const metrics = getSalesMetrics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {metrics.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Total acumulado</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">R$ {metrics.avgTicket.toFixed(2)}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Por venda realizada</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Clientes cadastrados</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.completionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Ordens finalizadas</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Gerar Relatórios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button
            onClick={generateSalesReport}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Relatório de Vendas</span>
          </button>

          <button
            onClick={generateTechnicianReport}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Relatório por Técnico</span>
          </button>

          <button
            onClick={() => setShowEquipmentReport(true)}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Wrench className="w-5 h-5" />
            <span>Relatório de Equipamentos</span>
          </button>

          <button
            onClick={generateInventoryReport}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Relatório de Estoque</span>
          </button>

          <button
            onClick={generateCustomersReport}
            className="bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Relatório de Clientes</span>
          </button>

          <button
            onClick={exportAllData}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Exportar Tudo</span>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas de Exportação:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Excel:</strong> Melhor para análises detalhadas e gráficos</li>
            <li>• <strong>Google Sheets:</strong> Ideal para colaboração em tempo real</li>
            <li>• <strong>CSV:</strong> Compatível com qualquer sistema</li>
            <li>• Os arquivos são formatados automaticamente no padrão brasileiro</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Vendas</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.slice(0, 10).map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{sale.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sale.technician}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">R$ {sale.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEquipmentReport && (
        <EquipmentReport onClose={() => setShowEquipmentReport(false)} />
      )}

      {showExportModal && exportData && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setExportData(null);
            setExportTitle('');
          }}
          data={exportData}
          title={exportTitle}
        />
      )}
    </div>
  );
};

export default ReportsList;
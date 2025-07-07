import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/Login/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import CustomerList from './components/Customers/CustomerList';
import ServiceOrderList from './components/ServiceOrders/ServiceOrderList';
import InventoryList from './components/Inventory/InventoryList';
import SalesList from './components/Sales/SalesList';
import BanksList from './components/Banks/BanksList';
import ReportsList from './components/Reports/ReportsList';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
//teste
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerList />;
      case 'service-orders':
        return <ServiceOrderList />;
      case 'inventory':
        return <InventoryList />;
      case 'sales':
        return <SalesList />;
      case 'banks':
        return <BanksList />;
      case 'reports':
        return <ReportsList />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h2>
            <p className="text-gray-600">Área de configurações do sistema.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const shouldAutoHide = user?.name === 'Humberto';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        shouldAutoHide ? 'md:ml-0' : ''
      }`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
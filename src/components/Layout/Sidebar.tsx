import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Users, 
  ClipboardList, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide navbar for Humberto user
  const shouldAutoHide = user?.name === 'Humberto';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (shouldAutoHide && !isMobile) {
      setIsVisible(false);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldAutoHide, isMobile]);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'technician', 'attendant'] },
    { id: 'customers', icon: Users, label: 'Clientes', roles: ['admin', 'technician', 'attendant'] },
    { id: 'service-orders', icon: ClipboardList, label: 'Ordens de Serviço', roles: ['admin', 'technician', 'attendant'] },
    { id: 'inventory', icon: Package, label: 'Estoque', roles: ['admin', 'technician'] },
    { id: 'sales', icon: ShoppingCart, label: 'Vendas', roles: ['admin', 'technician', 'attendant'] },
    { id: 'banks', icon: CreditCard, label: 'Bancos', roles: ['admin', 'technician', 'attendant'] },
    { id: 'reports', icon: BarChart3, label: 'Relatórios', roles: ['admin', 'technician'] },
    { id: 'settings', icon: Settings, label: 'Configurações', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'attendant')
  );

  const handleMouseEnter = () => {
    if (shouldAutoHide && !isMobile) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsHovered(true);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (shouldAutoHide && !isMobile) {
      setIsHovered(false);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout to hide the sidebar
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  // Clear timeout when component unmounts or when visibility changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md md:hidden"
        >
          {isVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mouse trigger area for auto-hide */}
      {shouldAutoHide && !isVisible && !isMobile && (
        <div
          className="fixed left-0 top-0 w-4 h-full z-50"
          onMouseEnter={handleMouseEnter}
        />
      )}
      
      {/* Overlay for mobile */}
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsVisible(false)}
        />
      )}
      
      <div 
        className={`bg-gray-900 text-white min-h-screen p-4 transition-all duration-300 ease-in-out z-40 ${
          shouldAutoHide && !isMobile
            ? `fixed left-0 top-0 ${isVisible ? 'translate-x-0' : '-translate-x-full'} w-64`
            : isMobile
            ? `fixed left-0 top-0 ${isVisible ? 'translate-x-0' : '-translate-x-full'} w-64`
            : 'w-64'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mb-8 mt-12 md:mt-0">
          <h1 className="text-2xl font-bold">CRM Técnico</h1>
          <p className="text-gray-400 text-sm mt-2">Bem-vindo, {user?.name}</p>
        </div>

        <nav className="space-y-2">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (isMobile) setIsVisible(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              logout();
              if (isMobile) setIsVisible(false);
            }}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
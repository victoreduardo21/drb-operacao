import React from 'react';
import { LayoutDashboard, Truck, Map as MapIcon, Database, Activity, LogOut } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} /> },
    { id: 'requests', label: 'Chamada Operação', icon: <Activity size={20} /> },
    { id: 'trips', label: 'Em Viagem', icon: <Truck size={20} /> },
    { id: 'map', label: 'Mapa Tempo Real', icon: <MapIcon size={20} /> },
    { id: 'terminals', label: 'Cadastro Terminal', icon: <Database size={20} /> },
  ];

  // Obtém as iniciais do nome para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-64 bg-[#020617] text-white h-screen flex flex-col fixed left-0 top-0 z-50 shadow-xl border-r border-white/5">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
          <Truck className="text-white" size={18} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">DRB Logística</h1>
          <p className="text-xs text-slate-400">Sistema Operacional</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Setor Operação
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-r-full mr-2
                  ${activePage === item.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-[#020617]">
            {user?.name ? getInitials(user.name) : 'OP'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-none mb-1">
              {user?.name || 'Operador'}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-xs text-slate-400 truncate">
                {user?.role || 'Online'}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
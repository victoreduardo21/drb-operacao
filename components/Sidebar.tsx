import React from 'react';
import { LayoutDashboard, Truck, Map as MapIcon, Database, Activity } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} /> },
    { id: 'requests', label: 'Chamada Operação', icon: <Activity size={20} /> },
    { id: 'trips', label: 'Em Viagem', icon: <Truck size={20} /> },
    { id: 'map', label: 'Mapa Tempo Real', icon: <MapIcon size={20} /> },
    { id: 'terminals', label: 'Cadastro Terminal', icon: <Database size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 shadow-xl">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
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
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            OP
          </div>
          <div>
            <p className="text-sm font-medium">Operador Logístico</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
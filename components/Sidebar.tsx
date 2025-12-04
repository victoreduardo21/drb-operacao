import React from 'react';
import { LayoutDashboard, Truck, Map as MapIcon, Database, Activity, LogOut, X } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, user, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={24} /> },
    { id: 'requests', label: 'Chamada Operação', icon: <Activity size={24} /> },
    { id: 'trips', label: 'Em Viagem', icon: <Truck size={24} /> },
    { id: 'map', label: 'Mapa Tempo Real', icon: <MapIcon size={24} /> },
    { id: 'terminals', label: 'Cadastro Terminal', icon: <Database size={24} /> },
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
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Aumentado para w-72 (Grande) */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-[#020617] text-white z-50 shadow-2xl border-r border-white/5
        transform transition-transform duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-screen lg:shadow-xl
      `}>
        {/* EFEITO DE FUNDO IGUAL AO LOGIN */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020617] to-[#020617] z-0 pointer-events-none"></div>
        
        {/* Conteúdo da Sidebar */}
        <div className="relative z-10 flex flex-col h-full">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Truck className="text-white" size={24} />
                </div>
                <div>
                <h1 className="font-bold text-lg leading-tight">DRB Logística</h1>
                <p className="text-sm text-blue-200/70">Sistema Operacional</p>
                </div>
            </div>
            {/* Close Button Mobile */}
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                <X size={28} />
            </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-8 custom-scrollbar">
            <div className="px-8 mb-4 text-sm font-bold text-blue-200/40 uppercase tracking-widest">
                Menu Principal
            </div>
            <ul className="space-y-2">
                {menuItems.map((item) => (
                <li key={item.id}>
                    <button
                    onClick={() => {
                        onNavigate(item.id);
                        onClose();
                    }}
                    className={`w-full flex items-center gap-4 px-8 py-4 text-base font-medium transition-all duration-200 rounded-r-full mr-6 border-l-[4px]
                        ${activePage === item.id 
                        ? 'bg-blue-600/20 text-blue-50 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                        : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                    <span className={activePage === item.id ? 'text-blue-400 drop-shadow-md' : ''}>{item.icon}</span>
                    {item.label}
                    </button>
                </li>
                ))}
            </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base font-bold text-white shadow-xl border-2 border-white/10">
                {user?.name ? getInitials(user.name) : 'OP'}
                </div>
                <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white truncate leading-none mb-1.5">
                    {user?.name || 'Operador'}
                </p>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <p className="text-sm text-blue-200/70 truncate">
                    {user?.role || 'Online'}
                    </p>
                </div>
                </div>
                <button 
                onClick={onLogout} 
                className="text-slate-400 hover:text-red-400 transition-colors p-2.5 hover:bg-white/10 rounded-xl"
                title="Sair"
                >
                <LogOut size={22} />
                </button>
            </div>
            </div>
        </div>
      </div>
    </>
  );
};
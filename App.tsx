import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OperationsRequests } from './components/OperationsRequests';
import { ActiveTrips } from './components/ActiveTrips';
import { TerminalRegistry } from './components/TerminalRegistry';
import { LiveMap } from './components/LiveMap';
import { Login } from './components/Login';
import { INITIAL_DATA } from './constants';
import { LogisticsData, TripStatus, User } from './types';
import { fetchTerminalsFromSheet, GOOGLE_SCRIPT_URL } from './services/backend';
import { analyzeOperations } from './services/geminiService';
import { Sparkles, TrendingUp, Truck, ClipboardList, Users, CheckCircle, Clock, Activity, AlertTriangle, BarChart3, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [data, setData] = useState<LogisticsData>(INITIAL_DATA);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSheetConnected, setIsSheetConnected] = useState(false);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load Terminals from Spreadsheet on Startup
  useEffect(() => {
    if (!user) return; // Only load data if logged in

    const loadTerminals = async () => {
      const terminals = await fetchTerminalsFromSheet();
      setData(prev => ({
        ...prev,
        terminals: terminals
      }));
      if (GOOGLE_SCRIPT_URL) setIsSheetConnected(true);
    };
    loadTerminals();
  }, [user]);

  // Simulating Real-time updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setData(currentData => {
        const updatedDrivers = currentData.drivers.map(d => ({
          ...d,
          currentLat: d.currentLat + (Math.random() - 0.5) * 0.005,
          currentLng: d.currentLng + (Math.random() - 0.5) * 0.005,
          lastUpdate: new Date().toISOString()
        }));
        return { ...currentData, drivers: updatedDrivers };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [user]);

  const handleAiAnalysis = async () => {
    setIsLoadingAi(true);
    setAiInsight(null);
    const insight = await analyzeOperations(data);
    setAiInsight(insight);
    setIsLoadingAi(false);
  };

  const handleLogout = () => {
    setUser(null);
    setData(INITIAL_DATA); // Reseta os dados para o estado inicial
  };

  const getRecentActivity = () => {
    const allEvents = data.trips.flatMap(trip => 
      trip.timeline.map(event => ({
        ...event,
        tripId: trip.id,
        driverName: data.drivers.find(d => d.id === trip.driverId)?.name || 'Sistema'
      }))
    );
    return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        const activeTripsCount = data.trips.filter(t => t.status !== TripStatus.PENDING && t.status !== TripStatus.COMPLETED).length;
        const pendingTripsCount = data.trips.filter(t => t.status === TripStatus.PENDING).length;
        const completedTripsCount = data.trips.filter(t => t.status === TripStatus.COMPLETED).length;
        const totalTrips = activeTripsCount + pendingTripsCount + completedTripsCount;
        
        const freeDriversCount = data.drivers.filter(d => d.status === 'Livre').length;
        const totalDrivers = data.drivers.length;

        // Calculate percentages for the bar chart
        const pctPending = totalTrips ? (pendingTripsCount / totalTrips) * 100 : 0;
        const pctActive = totalTrips ? (activeTripsCount / totalTrips) * 100 : 0;
        const pctCompleted = totalTrips ? (completedTripsCount / totalTrips) * 100 : 0;

        return (
          <div className="p-8 md:p-10 space-y-8 max-w-[1400px] mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Visão Geral</h2>
                <p className="text-base text-gray-500 mt-1">Olá, {user?.name}. Acompanhamento estratégico.</p>
              </div>
              
              {!isSheetConnected ? (
                 <div className="flex items-center gap-3 text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 w-fit">
                    <AlertTriangle size={16} />
                    Demo Mode
                 </div>
              ) : (
                <div className="flex items-center gap-3 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm animate-pulse w-fit">
                   <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                   Conectado Google Sheets
                </div>
              )}
            </div>

            {/* AI Analyst Panel - Large */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-xl text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={140} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-auto shrink-0 border-b md:border-b-0 md:border-r border-indigo-700/50 pb-6 md:pb-0 pr-0 md:pr-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-500/20 rounded-xl">
                                <Sparkles className="text-yellow-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Analista Virtual IA</h3>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-100 mb-4 leading-relaxed opacity-90 max-w-[220px]">
                            Solicite uma análise tática dos gargalos operacionais em tempo real.
                        </p>
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={isLoadingAi}
                            className="w-full bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoadingAi ? 'Analisando dados...' : 'Gerar Análise Tática'}
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center w-full">
                        {aiInsight ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 animate-in fade-in slide-in-from-right-4 shadow-inner">
                                <p className="text-base leading-relaxed whitespace-pre-line text-gray-50 font-medium">
                                    {aiInsight}
                                </p>
                            </div>
                        ) : (
                            <div className="h-full min-h-[120px] flex items-center justify-center text-indigo-300/60 text-sm italic border-2 border-dashed border-indigo-700/30 rounded-xl py-6">
                                Aguardando solicitação de análise para processar dados...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* KPI Metrics Grid - Large Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Viagens Ativas</p>
                        <h3 className="text-4xl font-bold text-gray-800 mt-2">{activeTripsCount}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Truck size={28} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded-lg">
                    <TrendingUp size={16} /> Operação Fluindo
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pendentes</p>
                        <h3 className="text-4xl font-bold text-gray-800 mt-2">{pendingTripsCount}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <ClipboardList size={28} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 w-fit px-2 py-1 rounded-lg">
                    Aguardando Aprovação
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Frota Livre</p>
                        <h3 className="text-4xl font-bold text-gray-800 mt-2">{freeDriversCount}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Users size={28} />
                    </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(freeDriversCount / totalDrivers) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right font-medium">{freeDriversCount} de {totalDrivers} motoristas</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Entregas Hoje</p>
                        <h3 className="text-4xl font-bold text-gray-800 mt-2">{completedTripsCount}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <CheckCircle size={28} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-medium bg-purple-50 w-fit px-2 py-1 rounded-lg">
                    100% no prazo
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Status Bar */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3">
                            <BarChart3 size={24} className="text-blue-600" /> Distribuição de Status de Viagens
                        </h3>
                    </div>
                    
                    <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden flex mb-6 shadow-inner">
                        <div className="bg-orange-400 h-full relative group" style={{ width: `${pctPending}%` }}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="bg-blue-500 h-full relative group" style={{ width: `${pctActive}%` }}>
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="bg-green-500 h-full relative group" style={{ width: `${pctCompleted}%` }}>
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-orange-400 ring-4 ring-orange-50"></div>
                            Pendentes <span className="text-gray-400 font-normal">({pendingTripsCount})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                            Em Trânsito <span className="text-gray-400 font-normal">({activeTripsCount})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-50"></div>
                            Finalizadas <span className="text-gray-400 font-normal">({completedTripsCount})</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-3">
                    <Activity size={24} className="text-blue-600" /> Últimas Atualizações
                    </h3>
                    <div className="space-y-1">
                    {getRecentActivity().map((event, idx) => (
                        <div key={idx} className="flex gap-5 relative group">
                        {idx !== 4 && <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gray-100 group-hover:bg-blue-100 transition-colors"></div>}
                        
                        <div className="mt-2 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                        </div>
                        
                        <div className="flex-1 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-gray-800">{event.event}</p>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-600 font-medium">{event.driverName}</p>
                                <span className="text-xs text-gray-400">•</span>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPinSmall /> {event.location}
                                </p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
          </div>
        );
      case 'requests':
        return <OperationsRequests data={data} onUpdate={setData} />;
      case 'trips':
        return <ActiveTrips data={data} />;
      case 'map':
        return <div className="h-[calc(100vh-64px)] lg:h-screen p-0 lg:p-6"><div className="h-full bg-white lg:rounded-2xl lg:shadow-md lg:border lg:border-gray-200 overflow-hidden max-w-[1400px] mx-auto w-full"><LiveMap data={data} /></div></div>;
      case 'terminals':
        return <TerminalRegistry data={data} onUpdate={setData} />;
      default:
        return <div className="p-10">Página em construção</div>;
    }
  };

  // Login Flow
  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-sm font-['Inter']">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#020617] text-white z-40 flex items-center justify-between px-6 shadow-md">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020617] to-[#020617] pointer-events-none"></div>
         
         <div className="relative z-10 flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
               <Menu size={24} />
             </button>
             <span className="font-bold text-lg tracking-tight">DRB Logística</span>
         </div>
         <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold border border-white/20">
            {user.name.charAt(0)}
         </div>
      </div>

      <div className="flex w-full">
         <Sidebar 
            activePage={activePage} 
            onNavigate={setActivePage} 
            user={user} 
            onLogout={handleLogout} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
         />
         
         {/* Main Content Area - Aumentado para ml-72 */}
         <main className="flex-1 w-full lg:ml-72 pt-16 lg:pt-0 overflow-y-auto h-screen custom-scrollbar relative">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

const MapPinSmall = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

export default App;
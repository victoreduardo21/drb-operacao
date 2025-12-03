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
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Visão Geral da Operação</h2>
                <p className="text-sm md:text-base text-gray-500">Olá, {user?.name}. Acompanhamento estratégico.</p>
              </div>
              
              {!isSheetConnected ? (
                 <div className="flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 w-fit">
                    <AlertTriangle size={14} />
                    Demo Mode (Sem Planilha)
                 </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 shadow-sm animate-pulse w-fit">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   Conectado Google Sheets
                </div>
              )}
            </div>

            {/* AI Analyst Panel - Featured at Top */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-xl text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-indigo-700/50 pb-4 md:pb-0 pr-0 md:pr-6">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Sparkles className="text-yellow-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Analista Virtual</h3>
                                <p className="text-indigo-200 text-xs">Inteligência Artificial DRB</p>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-100 mb-4 leading-relaxed opacity-80">
                            Clique no botão para analisar gargalos operacionais, eficiência de rota e alocação de motoristas em tempo real.
                        </p>
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={isLoadingAi}
                            className="w-full bg-white text-indigo-900 font-bold py-2.5 px-4 rounded-lg shadow hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoadingAi ? 'Analisando...' : 'Gerar Análise Tática'}
                        </button>
                    </div>

                    <div className="md:w-2/3 flex flex-col justify-center">
                        {aiInsight ? (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-right-4">
                                <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Relatório Gerado:</h4>
                                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-100 font-medium">
                                    {aiInsight}
                                </p>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-indigo-300/50 text-sm italic border border-dashed border-indigo-700/50 rounded-xl py-6 md:py-0">
                                Aguardando solicitação de análise...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Status Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hidden md:block">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" /> Distribuição de Viagens
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">Total: {totalTrips}</span>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-orange-400 h-full" style={{ width: `${pctPending}%` }} title="Pendentes"></div>
                    <div className="bg-blue-500 h-full" style={{ width: `${pctActive}%` }} title="Em Trânsito"></div>
                    <div className="bg-green-500 h-full" style={{ width: `${pctCompleted}%` }} title="Finalizadas"></div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center gap-6 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        Pendentes ({pendingTripsCount})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Em Trânsito ({activeTripsCount})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Finalizadas ({completedTripsCount})
                    </div>
                </div>
            </div>

            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Viagens Ativas</p>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{activeTripsCount}</h3>
                    </div>
                    <div className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Truck size={16} className="md:w-5 md:h-5" />
                    </div>
                </div>
                <div className="mt-3 text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 w-fit px-2 py-0.5 rounded">
                   <TrendingUp size={12} /> Normal
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Pendentes</p>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{pendingTripsCount}</h3>
                    </div>
                    <div className="p-1.5 md:p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <ClipboardList size={16} className="md:w-5 md:h-5" />
                    </div>
                </div>
                 <div className={`mt-3 text-xs flex items-center gap-1 font-medium w-fit px-2 py-0.5 rounded ${pendingTripsCount > 0 ? 'text-orange-600 bg-orange-50' : 'text-gray-400 bg-gray-100'}`}>
                   {pendingTripsCount > 0 ? 'Aguardando' : 'Em dia'}
                </div>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Frota Livre</p>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{freeDriversCount}</h3>
                    </div>
                    <div className="p-1.5 md:p-2 bg-green-50 text-green-600 rounded-lg">
                        <Users size={16} className="md:w-5 md:h-5" />
                    </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-4">
                    <div className="bg-green-500 h-1 rounded-full transition-all duration-500" style={{ width: `${(freeDriversCount / totalDrivers) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">{freeDriversCount}/{totalDrivers}</p>
              </div>

              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Entregas</p>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{completedTripsCount}</h3>
                    </div>
                    <div className="p-1.5 md:p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <CheckCircle size={16} className="md:w-5 md:h-5" />
                    </div>
                </div>
                <div className="mt-3 text-xs text-purple-600 flex items-center gap-1 font-medium bg-purple-50 w-fit px-2 py-0.5 rounded">
                   100% no prazo
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-blue-600" /> Últimas Atualizações
                </h3>
                <div className="space-y-0">
                  {getRecentActivity().map((event, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                      {/* Timeline Line */}
                      {idx !== 4 && <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>}
                      
                      <div className="mt-1 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                      </div>
                      
                      <div className="flex-1 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-gray-800">{event.event}</p>
                          <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                            <Clock size={10} />
                            {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                             <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                 {event.driverName}
                             </span>
                             <span className="text-xs text-gray-400">•</span>
                             <span className="text-xs text-gray-500">Viagem {event.tripId}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                           <MapPinSmall /> {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                  {getRecentActivity().length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">Nenhuma atividade registrada ainda.</p>
                  )}
                </div>
            </div>
          </div>
        );
      case 'requests':
        return <OperationsRequests data={data} onUpdate={setData} />;
      case 'trips':
        return <ActiveTrips data={data} />;
      case 'map':
        return <div className="h-[calc(100vh-80px)] lg:h-screen p-0 lg:p-4"><div className="h-full bg-white lg:rounded-xl lg:shadow lg:border lg:border-gray-200"><LiveMap data={data} /></div></div>;
      case 'terminals':
        return <TerminalRegistry data={data} onUpdate={setData} />;
      default:
        return <div className="p-8">Página em construção</div>;
    }
  };

  // Login Flow
  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#020617] text-white z-40 flex items-center justify-between px-4 shadow-md">
         <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded-lg">
               <Menu size={24} />
             </button>
             <span className="font-bold text-lg tracking-tight">DRB Logística</span>
         </div>
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold border border-white/20">
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
         
         {/* Main Content Area */}
         {/* Added 'pt-16' for mobile header space, 'lg:pt-0' for desktop */}
         {/* Changed 'ml-64' to 'lg:ml-64' to remove margin on mobile */}
         <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-0 overflow-y-auto h-screen custom-scrollbar relative">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

// Mini helper component for the map pin icon in recent activity
const MapPinSmall = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

export default App;
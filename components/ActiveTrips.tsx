import React, { useState } from 'react';
import { LogisticsData, TripStatus } from '../types';
import { Package, User, Search, X, Calendar, Flag, Truck, CheckSquare, MapPin } from 'lucide-react';

interface Props {
  data: LogisticsData;
}

export const ActiveTrips: React.FC<Props> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const trips = data.trips.filter(t => t.status !== TripStatus.PENDING);

  // Helper to clean plate string
  const formatPlate = (plate?: string) => plate ? plate.replace(/[\s-]/g, '').toUpperCase() : '';

  // The 5 mandatory steps for the timeline
  const WORKFLOW_STEPS = [
    { label: 'Iniciou', icon: <Truck size={16} /> },
    { label: 'Na Origem', icon: <MapPin size={16} /> },
    { label: 'Em Rota', icon: <Flag size={16} /> },
    { label: 'No Destino', icon: <MapPin size={16} /> },
    { label: 'Finalizado', icon: <CheckSquare size={16} /> },
  ];

  // Filter Logic
  const filteredTrips = trips.filter(trip => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toUpperCase().replace(/[\s-]/g, ''); // Normalize query
    const driver = data.drivers.find(d => d.id === trip.driverId);
    const plate = formatPlate(driver?.plate); // Normalize plate
    const customer = trip.customerName.toUpperCase();
    const driverName = driver?.name.toUpperCase() || '';
    const tripId = trip.id.toUpperCase();

    // Check if query matches any of these fields
    return plate.includes(query) || 
           driverName.includes(query) || 
           customer.includes(query) || 
           tripId.includes(query);
  });

  return (
    <div className="p-8 md:p-10 max-w-[1400px] mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Em Viagem</h2>
          <p className="text-base text-gray-500 mt-1">Fluxo de transporte em tempo real.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar placa, motorista ou ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all text-base font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {filteredTrips.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100 border-dashed">
                <p className="text-base text-gray-400 font-medium">Nenhuma viagem encontrada com este filtro.</p>
            </div>
        )}

        {filteredTrips.map(trip => {
           const origin = data.terminals.find(t => t.id === trip.originTerminalId);
           const dest = data.terminals.find(t => t.id === trip.destinationTerminalId);
           const driver = data.drivers.find(d => d.id === trip.driverId);

           return (
            <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300 hover:shadow-md transition-shadow">
              
              {/* Left Column: Trip Info & Driver */}
              <div className="w-full lg:w-4/12 p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between bg-slate-50/30">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg border border-blue-200">
                      {trip.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                        ${trip.status === TripStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {trip.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{trip.customerName}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 font-medium">
                    <Package size={18} />
                    <span>{trip.cargoType}</span>
                  </div>

                  {/* Driver Card */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                        <User size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base text-gray-800 leading-tight truncate">{driver?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded font-mono border border-yellow-200 font-bold tracking-wider">
                             {formatPlate(driver?.plate) || '---'}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/50 text-xs text-gray-400 flex items-center gap-2 font-medium">
                   <Calendar size={14} />
                   <span>Criado: {new Date(trip.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Right Column: 5-Step Progress Bar */}
              <div className="w-full lg:w-8/12 bg-white p-8 flex flex-col justify-center">
                 <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className="flex items-center justify-between min-w-[600px] relative px-6">
                        
                        {/* Background Progress Line */}
                        <div className="absolute top-[22px] left-12 right-12 h-1.5 bg-gray-100 -z-0 rounded-full"></div>

                        {WORKFLOW_STEPS.map((step, index) => {
                          const completedEvent = trip.timeline.find(e => e.event === step.label || (index === 0 && e.event === 'Iniciou Viagem') || (index === 1 && e.event === 'Chegou na Origem') || (index === 2 && e.event === 'Saiu para Entrega'));
                          
                          // Simplified Logic for Demo Visualization
                          const statusOrder = [TripStatus.PENDING, TripStatus.TO_ORIGIN, TripStatus.AT_ORIGIN, TripStatus.IN_TRANSIT, TripStatus.AT_DESTINATION, TripStatus.COMPLETED];
                          const currentStepIndex = statusOrder.indexOf(trip.status);
                          const mapStepToStatus = [1, 2, 3, 4, 5];
                          const isCompleted = currentStepIndex >= mapStepToStatus[index];

                          // Contextual info
                          let subLabel = '';
                          if (index === 1) subLabel = origin?.name || '';
                          if (index === 3) subLabel = dest?.name || '';

                          return (
                            <div key={index} className="relative z-10 flex flex-col items-center group w-28">
                                {/* Node Circle */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ring-8 ring-white shadow-sm mb-3 transition-all duration-300
                                  ${isCompleted ? (index === 4 ? 'bg-green-500 scale-110' : 'bg-blue-600 scale-110') : 'bg-gray-200 text-gray-400'}
                                `}>
                                  <span className={`text-white ${!isCompleted && 'text-gray-400'}`}>
                                    {React.cloneElement(step.icon as React.ReactElement, { size: 20 })}
                                  </span>
                                </div>
                                
                                {/* Labels */}
                                <div className="text-center w-full px-0.5">
                                    <p className={`text-xs font-bold mb-1 leading-tight ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                      {step.label}
                                    </p>
                                    
                                    {subLabel && (
                                      <p className={`text-[10px] py-0.5 px-2 rounded inline-block truncate max-w-full font-medium
                                        ${isCompleted ? 'bg-gray-50 text-gray-500 border border-gray-100' : 'text-transparent'}
                                      `} title={subLabel}>
                                        {subLabel}
                                      </p>
                                    )}
                                </div>
                            </div>
                          );
                        })}
                    </div>
                 </div>
              </div>

            </div>
           );
        })}
      </div>
    </div>
  );
};
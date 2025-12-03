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
    { label: 'Iniciou Viagem', icon: <Truck size={14} /> },
    { label: 'Chegou na Origem', icon: <MapPin size={14} /> },
    { label: 'Saiu para Entrega', icon: <Flag size={14} /> },
    { label: 'Chegou no Destino', icon: <MapPin size={14} /> },
    { label: 'Finalizou Entrega', icon: <CheckSquare size={14} /> },
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
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Em Viagem</h2>
          <p className="text-gray-500">Acompanhamento do fluxo de transporte em tempo real.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar placa, motorista ou ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {filteredTrips.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-400">Nenhuma viagem encontrada para "{searchQuery}"</p>
            </div>
        )}

        {filteredTrips.map(trip => {
           const origin = data.terminals.find(t => t.id === trip.originTerminalId);
           const dest = data.terminals.find(t => t.id === trip.destinationTerminalId);
           const driver = data.drivers.find(d => d.id === trip.driverId);

           return (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Left Column: Trip Info & Driver */}
              <div className="w-full lg:w-4/12 p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded border border-blue-200">
                      {trip.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${trip.status === TripStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {trip.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{trip.customerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Package size={16} />
                    <span>{trip.cargoType}</span>
                  </div>

                  {/* Driver Card */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{driver?.name}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-mono border border-yellow-200 font-bold">
                             {formatPlate(driver?.plate) || '---'}
                           </span>
                           <span className="text-[10px] text-gray-400">Responsável</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/50 text-xs text-gray-400 flex items-center gap-2">
                   <Calendar size={14} />
                   <span>Criado em: {new Date(trip.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Right Column: 5-Step Progress Bar */}
              <div className="w-full lg:w-8/12 bg-white p-8 flex flex-col justify-center">
                 <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className="flex items-center justify-between min-w-[650px] relative px-4">
                        
                        {/* Background Progress Line */}
                        <div className="absolute top-[18px] left-12 right-12 h-1 bg-gray-100 -z-0 rounded-full"></div>

                        {WORKFLOW_STEPS.map((step, index) => {
                          // Find if this step is completed in the timeline
                          const completedEvent = trip.timeline.find(e => e.event === step.label);
                          const isCompleted = !!completedEvent;
                          const isLastCompleted = trip.timeline.length > 0 && trip.timeline[trip.timeline.length - 1].event === step.label;

                          // Contextual info (Origin name on step 2, Dest name on step 4)
                          let subLabel = completedEvent ? new Date(completedEvent.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
                          
                          if (index === 1) subLabel = origin?.name || subLabel; // Chegou Origem
                          if (index === 3) subLabel = dest?.name || subLabel;   // Chegou Destino

                          return (
                            <div key={index} className="relative z-10 flex flex-col items-center group w-32">
                                {/* Node Circle */}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm mb-3 transition-all duration-300
                                  ${isCompleted ? (index === 4 ? 'bg-green-500' : 'bg-blue-600') : 'bg-gray-200 text-gray-400'}
                                  ${isLastCompleted ? 'scale-110 ring-blue-100' : ''}
                                `}>
                                  <span className={`text-white ${!isCompleted && 'text-gray-400'}`}>
                                    {step.icon}
                                  </span>
                                </div>
                                
                                {/* Labels */}
                                <div className="text-center w-full px-1">
                                    <p className={`text-xs font-bold mb-1 leading-tight ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                      {step.label}
                                    </p>
                                    
                                    {/* Sub-label: Timestamp or Terminal Name */}
                                    {subLabel && (
                                      <p className={`text-[10px] py-0.5 px-1.5 rounded inline-block truncate max-w-full
                                        ${isCompleted ? 'bg-gray-50 text-gray-500 border border-gray-100' : 'text-transparent'}
                                      `} title={subLabel}>
                                        {subLabel}
                                      </p>
                                    )}

                                    {/* Extra Timestamp if Terminal Name took priority */}
                                    {(index === 1 || index === 3) && isCompleted && completedEvent && (
                                       <p className="text-[10px] text-gray-400 mt-0.5">
                                         {new Date(completedEvent.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
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
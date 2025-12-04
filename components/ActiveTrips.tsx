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
    { label: 'Iniciou', icon: <Truck size={12} /> },
    { label: 'Na Origem', icon: <MapPin size={12} /> },
    { label: 'Em Rota', icon: <Flag size={12} /> },
    { label: 'No Destino', icon: <MapPin size={12} /> },
    { label: 'Finalizado', icon: <CheckSquare size={12} /> },
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
    <div className="p-4 md:p-6">
      <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Em Viagem</h2>
          <p className="text-sm text-gray-500">Fluxo de transporte em tempo real.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar placa ou ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTrips.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-sm text-gray-400">Nenhuma viagem encontrada.</p>
            </div>
        )}

        {filteredTrips.map(trip => {
           const origin = data.terminals.find(t => t.id === trip.originTerminalId);
           const dest = data.terminals.find(t => t.id === trip.destinationTerminalId);
           const driver = data.drivers.find(d => d.id === trip.driverId);

           return (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Left Column: Trip Info & Driver */}
              <div className="w-full lg:w-4/12 p-4 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                      {trip.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${trip.status === TripStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {trip.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-gray-900 mb-0.5 leading-tight">{trip.customerName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                    <Package size={14} />
                    <span>{trip.cargoType}</span>
                  </div>

                  {/* Driver Card */}
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800 leading-tight">{driver?.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0 rounded font-mono border border-yellow-200 font-bold">
                             {formatPlate(driver?.plate) || '---'}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/50 text-[10px] text-gray-400 flex items-center gap-1.5">
                   <Calendar size={12} />
                   <span>Criado: {new Date(trip.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Right Column: 5-Step Progress Bar */}
              <div className="w-full lg:w-8/12 bg-white p-5 flex flex-col justify-center">
                 <div className="overflow-x-auto custom-scrollbar pb-1">
                    <div className="flex items-center justify-between min-w-[500px] relative px-2">
                        
                        {/* Background Progress Line */}
                        <div className="absolute top-[14px] left-8 right-8 h-0.5 bg-gray-100 -z-0 rounded-full"></div>

                        {WORKFLOW_STEPS.map((step, index) => {
                          const completedEvent = trip.timeline.find(e => e.event === step.label || (index === 0 && e.event === 'Iniciou Viagem') || (index === 1 && e.event === 'Chegou na Origem') || (index === 2 && e.event === 'Saiu para Entrega'));
                          
                          // Simplified Logic for Demo Visualization
                          // If current status is beyond this step, mark as done.
                          const statusOrder = [TripStatus.PENDING, TripStatus.TO_ORIGIN, TripStatus.AT_ORIGIN, TripStatus.IN_TRANSIT, TripStatus.AT_DESTINATION, TripStatus.COMPLETED];
                          const currentStepIndex = statusOrder.indexOf(trip.status);
                          // Map step index to approximate status index
                          const mapStepToStatus = [1, 2, 3, 4, 5];
                          const isCompleted = currentStepIndex >= mapStepToStatus[index];

                          // Contextual info
                          let subLabel = '';
                          if (index === 1) subLabel = origin?.name || '';
                          if (index === 3) subLabel = dest?.name || '';

                          return (
                            <div key={index} className="relative z-10 flex flex-col items-center group w-24">
                                {/* Node Circle */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm mb-2 transition-all duration-300
                                  ${isCompleted ? (index === 4 ? 'bg-green-500' : 'bg-blue-600') : 'bg-gray-200 text-gray-400'}
                                `}>
                                  <span className={`text-white ${!isCompleted && 'text-gray-400'}`}>
                                    {step.icon}
                                  </span>
                                </div>
                                
                                {/* Labels */}
                                <div className="text-center w-full px-0.5">
                                    <p className={`text-[10px] font-bold mb-0.5 leading-tight ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                      {step.label}
                                    </p>
                                    
                                    {subLabel && (
                                      <p className={`text-[9px] py-0.5 px-1 rounded inline-block truncate max-w-full
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
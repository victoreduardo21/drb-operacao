import React from 'react';
import { LogisticsData, TripStatus } from '../types';
import { Clock, CheckCircle, Plus } from 'lucide-react';

interface Props {
  data: LogisticsData;
  onUpdate: (data: LogisticsData) => void;
}

export const OperationsRequests: React.FC<Props> = ({ data }) => {
  const pendingTrips = data.trips.filter(t => t.status === TripStatus.PENDING);
  const activeTrips = data.trips.filter(t => t.status !== TripStatus.PENDING && t.status !== TripStatus.COMPLETED);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Chamada Operação</h2>
          <p className="text-sm text-gray-500">Gerenciamento de solicitações e despacho.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-lg shadow-blue-500/30">
          <Plus size={16} />
          Nova Solicitação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Requests Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-160px)]">
          <div className="p-3 border-b border-gray-100 bg-orange-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold text-sm text-orange-800 flex items-center gap-2">
              <Clock size={16} /> Pendentes
            </h3>
            <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingTrips.length}</span>
          </div>
          <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
            {pendingTrips.length === 0 && <p className="text-center text-xs text-gray-400 py-10">Nenhuma solicitação pendente.</p>}
            {pendingTrips.map(trip => (
              <div key={trip.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-l-lg"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-gray-400">{trip.id}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{new Date(trip.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-800 mb-0.5">{trip.customerName}</h4>
                <p className="text-xs text-gray-500 mb-2">{trip.cargoType}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded">
                  <span className="font-medium text-gray-700">{data.terminals.find(t => t.id === trip.originTerminalId)?.name || 'Origem'}</span>
                  <span className="text-gray-400">➔</span>
                  <span className="font-medium text-gray-700">{data.terminals.find(t => t.id === trip.destinationTerminalId)?.name || 'Destino'}</span>
                </div>
                <button className="mt-2 w-full bg-orange-100 text-orange-700 hover:bg-orange-200 py-1 rounded text-xs font-medium transition-colors">
                  Alocar Motorista
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned/In Progress Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-160px)] lg:col-span-2">
          <div className="p-3 border-b border-gray-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
             <h3 className="font-semibold text-sm text-blue-800 flex items-center gap-2">
              <CheckCircle size={16} /> Em Andamento (Recentes)
            </h3>
             <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{activeTrips.length}</span>
          </div>
          <div className="p-0 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-[10px] uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Motorista</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 text-xs">{trip.id}</td>
                    <td className="px-4 py-3 text-xs">{trip.customerName}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {data.drivers.find(d => d.id === trip.driverId)?.name.charAt(0)}
                      </div>
                      <span className="text-xs">{data.drivers.find(d => d.id === trip.driverId)?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${trip.status === TripStatus.AT_ORIGIN ? 'bg-yellow-100 text-yellow-700' :
                          trip.status === TripStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' :
                          trip.status === TripStatus.AT_DESTINATION ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                       <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
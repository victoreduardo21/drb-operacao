import React from 'react';
import { LogisticsData, TripStatus } from '../types';
import { Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

interface Props {
  data: LogisticsData;
  onUpdate: (data: LogisticsData) => void;
}

export const OperationsRequests: React.FC<Props> = ({ data }) => {
  const pendingTrips = data.trips.filter(t => t.status === TripStatus.PENDING);
  const activeTrips = data.trips.filter(t => t.status !== TripStatus.PENDING && t.status !== TripStatus.COMPLETED);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chamada Operação</h2>
          <p className="text-gray-500">Gerenciamento de solicitações e despacho de cargas.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-500/30">
          <Plus size={18} />
          Nova Solicitação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)]">
          <div className="p-4 border-b border-gray-100 bg-orange-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold text-orange-800 flex items-center gap-2">
              <Clock size={18} /> Pendentes
            </h3>
            <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">{pendingTrips.length}</span>
          </div>
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {pendingTrips.length === 0 && <p className="text-center text-gray-400 py-10">Nenhuma solicitação pendente.</p>}
            {pendingTrips.map(trip => (
              <div key={trip.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-l-lg"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-400">{trip.id}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{new Date(trip.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{trip.customerName}</h4>
                <p className="text-sm text-gray-500 mb-3">{trip.cargoType}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium text-gray-700">{data.terminals.find(t => t.id === trip.originTerminalId)?.name || 'Origem'}</span>
                  <span className="text-gray-400">➔</span>
                  <span className="font-medium text-gray-700">{data.terminals.find(t => t.id === trip.destinationTerminalId)?.name || 'Destino'}</span>
                </div>
                <button className="mt-3 w-full bg-orange-100 text-orange-700 hover:bg-orange-200 py-1.5 rounded text-sm font-medium transition-colors">
                  Alocar Motorista
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned/In Progress Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)] lg:col-span-2">
          <div className="p-4 border-b border-gray-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
             <h3 className="font-semibold text-blue-800 flex items-center gap-2">
              <CheckCircle size={18} /> Em Andamento (Recentes)
            </h3>
             <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{activeTrips.length}</span>
          </div>
          <div className="p-0 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Motorista</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{trip.id}</td>
                    <td className="px-6 py-4">{trip.customerName}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {data.drivers.find(d => d.id === trip.driverId)?.name.charAt(0)}
                      </div>
                      {data.drivers.find(d => d.id === trip.driverId)?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${trip.status === TripStatus.AT_ORIGIN ? 'bg-yellow-100 text-yellow-700' :
                          trip.status === TripStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' :
                          trip.status === TripStatus.AT_DESTINATION ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
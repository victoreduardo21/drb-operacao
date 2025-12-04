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
    <div className="p-8 md:p-10 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Chamada Operação</h2>
          <p className="text-base text-gray-500 mt-1">Gerenciamento de solicitações e despacho.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 text-base font-medium transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5">
          <Plus size={20} />
          Nova Solicitação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Requests Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)]">
          <div className="p-6 border-b border-gray-100 bg-orange-50 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-base text-orange-800 flex items-center gap-3">
              <Clock size={20} /> Pendentes
            </h3>
            <span className="bg-orange-200 text-orange-900 text-sm font-bold px-3 py-1 rounded-full shadow-sm">{pendingTrips.length}</span>
          </div>
          <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
            {pendingTrips.length === 0 && <p className="text-center text-base text-gray-400 py-12">Nenhuma solicitação pendente.</p>}
            {pendingTrips.map(trip => (
              <div key={trip.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer relative group hover:border-orange-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-400 rounded-l-xl"></div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-gray-500">{trip.id}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">{new Date(trip.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{trip.customerName}</h4>
                <p className="text-sm text-gray-500 mb-4 font-medium bg-slate-50 w-fit px-2 py-1 rounded">{trip.cargoType}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-800 max-w-[120px] truncate" title={data.terminals.find(t => t.id === trip.originTerminalId)?.name}>{data.terminals.find(t => t.id === trip.originTerminalId)?.name || 'Origem'}</span>
                  <span className="text-gray-400 font-bold">➔</span>
                  <span className="font-semibold text-gray-800 max-w-[120px] truncate" title={data.terminals.find(t => t.id === trip.destinationTerminalId)?.name}>{data.terminals.find(t => t.id === trip.destinationTerminalId)?.name || 'Destino'}</span>
                </div>
                <button className="mt-4 w-full bg-orange-50 text-orange-700 hover:bg-orange-100 py-2.5 rounded-xl text-sm font-bold transition-colors border border-orange-100">
                  Alocar Motorista
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned/In Progress Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)] lg:col-span-2">
          <div className="p-6 border-b border-gray-100 bg-blue-50 rounded-t-2xl flex justify-between items-center">
             <h3 className="font-bold text-base text-blue-800 flex items-center gap-3">
              <CheckCircle size={20} /> Em Andamento
            </h3>
             <span className="bg-blue-200 text-blue-900 text-sm font-bold px-3 py-1 rounded-full shadow-sm">{activeTrips.length}</span>
          </div>
          <div className="p-0 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-5">ID</th>
                  <th className="px-6 py-5">Cliente</th>
                  <th className="px-6 py-5">Motorista</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-gray-900 text-sm">{trip.id}</td>
                    <td className="px-6 py-5 text-sm font-medium">{trip.customerName}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm border border-blue-200">
                          {data.drivers.find(d => d.id === trip.driverId)?.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{data.drivers.find(d => d.id === trip.driverId)?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm
                        ${trip.status === TripStatus.AT_ORIGIN ? 'bg-yellow-100 text-yellow-800' :
                          trip.status === TripStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-800' :
                          trip.status === TripStatus.AT_DESTINATION ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="text-blue-600 hover:text-blue-800 font-bold text-sm px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors">Detalhes</button>
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
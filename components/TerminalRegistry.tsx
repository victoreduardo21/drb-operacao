import React, { useState } from 'react';
import { LogisticsData, Terminal } from '../types';
import { MapPin, Save, Trash2, Database, Building, FileText } from 'lucide-react';

interface Props {
  data: LogisticsData;
  onUpdate: (data: LogisticsData) => void;
}

export const TerminalRegistry: React.FC<Props> = ({ data, onUpdate }) => {
  const [newTerminal, setNewTerminal] = useState<Partial<Terminal>>({
    name: '',
    lat: -23.55,
    lng: -46.63,
    radius: 0.1,
    capacity: 0,
    city: '',
    cnpj: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerminal.name) return;

    const terminal: Terminal = {
      id: `T${Date.now()}`,
      name: newTerminal.name || 'Novo Terminal',
      lat: Number(newTerminal.lat),
      lng: Number(newTerminal.lng),
      radius: Number(newTerminal.radius),
      capacity: Number(newTerminal.capacity),
      city: newTerminal.city,
      cnpj: newTerminal.cnpj
    };

    onUpdate({
      ...data,
      terminals: [...data.terminals, terminal]
    });

    setNewTerminal({ name: '', lat: -23.55, lng: -46.63, radius: 0.1, capacity: 0, city: '', cnpj: '' });
  };

  const handleDelete = (id: string) => {
    onUpdate({
      ...data,
      terminals: data.terminals.filter(t => t.id !== id)
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Cadastro de Terminais</h2>
                <p className="text-sm text-gray-500">Sincronizado com Planilha Google.</p>
            </div>
            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-blue-800 text-xs font-medium">
                Total: <span className="font-bold">{data.terminals.length}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-blue-700">
            <Database size={16} /> Novo Terminal Manual
          </h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
              <input 
                type="text" 
                value={newTerminal.name}
                onChange={e => setNewTerminal({...newTerminal, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: CD Zona Sul"
                required
              />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                <input 
                  type="text" 
                  value={newTerminal.city}
                  onChange={e => setNewTerminal({...newTerminal, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lat}
                  onChange={e => setNewTerminal({...newTerminal, lat: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lng}
                  onChange={e => setNewTerminal({...newTerminal, lng: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
              <Save size={16} /> Salvar
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {data.terminals.length === 0 && (
             <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-sm">
                Nenhum terminal carregado.
             </div>
          )}

          {data.terminals.map(terminal => (
            <div key={terminal.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative group hover:border-blue-300 transition-colors flex flex-col md:flex-row gap-3 items-start md:items-center">
              
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Building size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                   <h4 className="font-bold text-gray-800 text-base">{terminal.name}</h4>
                   <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">ID: {terminal.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-gray-600">
                   <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      <span>{terminal.city || 'Cidade N/D'}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <FileText size={12} className="text-gray-400" />
                      <span className="font-mono">{terminal.cnpj || 'CNPJ N/D'}</span>
                   </div>
                   {terminal.address && (
                       <div className="col-span-2 text-[10px] text-gray-500 mt-0.5 truncate max-w-md" title={terminal.address}>
                          {terminal.address}
                       </div>
                   )}
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <div className="text-[10px] text-gray-400 font-mono">
                      {terminal.lat.toFixed(5)}, {terminal.lng.toFixed(5)}
                  </div>
                  <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      Raio: {terminal.radius} km
                  </div>
              </div>

              <button 
                  onClick={() => handleDelete(terminal.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
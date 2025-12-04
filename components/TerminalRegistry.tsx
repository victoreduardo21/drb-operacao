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
    <div className="p-8 md:p-10 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Cadastro de Terminais</h2>
                <p className="text-base text-gray-500 mt-1">Gestão de pontos de interesse.</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-blue-800 text-sm font-bold">
                Total: <span className="text-xl ml-1">{data.terminals.length}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base mb-6 flex items-center gap-3 text-blue-800 bg-blue-50 p-3 rounded-xl">
            <Database size={20} /> Novo Terminal
          </h3>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Nome do Local</label>
              <input 
                type="text" 
                value={newTerminal.name}
                onChange={e => setNewTerminal({...newTerminal, name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: CD Zona Sul"
                required
              />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Cidade</label>
                <input 
                  type="text" 
                  value={newTerminal.city}
                  onChange={e => setNewTerminal({...newTerminal, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lat}
                  onChange={e => setNewTerminal({...newTerminal, lat: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lng}
                  onChange={e => setNewTerminal({...newTerminal, lng: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-lg text-sm mt-4">
              <Save size={18} /> Salvar Terminal
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {data.terminals.length === 0 && (
             <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-sm font-medium">
                Nenhum terminal carregado na base de dados.
             </div>
          )}

          {data.terminals.map(terminal => (
            <div key={terminal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative group hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center">
              
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Building size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <h4 className="font-bold text-gray-900 text-lg truncate">{terminal.name}</h4>
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md border border-gray-200 font-mono">ID: {terminal.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                   <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{terminal.city || 'Cidade N/D'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="font-mono">{terminal.cnpj || 'CNPJ N/D'}</span>
                   </div>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400 font-mono hidden md:block bg-gray-50 px-2 py-1 rounded">
                      {terminal.lat.toFixed(5)}, {terminal.lng.toFixed(5)}
                  </div>
                  <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      Raio: {terminal.radius} km
                  </div>
              </div>

              <button 
                  onClick={() => handleDelete(terminal.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
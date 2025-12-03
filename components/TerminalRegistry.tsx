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
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Cadastro de Terminais</h2>
                <p className="text-gray-500">Sincronizado com Planilha Google.</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-blue-800 text-sm font-medium">
                Total Cadastrado: <span className="font-bold text-lg">{data.terminals.length}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
            <Database size={20} /> Novo Terminal Manual
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Terminal</label>
              <input 
                type="text" 
                value={newTerminal.name}
                onChange={e => setNewTerminal({...newTerminal, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: CD Zona Sul"
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input 
                  type="text" 
                  value={newTerminal.city}
                  onChange={e => setNewTerminal({...newTerminal, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lat}
                  onChange={e => setNewTerminal({...newTerminal, lat: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={newTerminal.lng}
                  onChange={e => setNewTerminal({...newTerminal, lng: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Save size={18} /> Salvar Terminal
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {data.terminals.length === 0 && (
             <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                Nenhum terminal carregado da planilha.
             </div>
          )}

          {data.terminals.map(terminal => (
            <div key={terminal.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative group hover:border-blue-300 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
              
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Building size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <h4 className="font-bold text-gray-800 text-lg">{terminal.name}</h4>
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">ID: {terminal.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                   <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{terminal.city || 'Cidade N/D'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="font-mono text-xs">{terminal.cnpj || 'CNPJ N/D'}</span>
                   </div>
                   {terminal.address && (
                       <div className="col-span-2 text-xs text-gray-500 mt-1 truncate max-w-md" title={terminal.address}>
                          {terminal.address}
                       </div>
                   )}
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400 font-mono">
                      {terminal.lat.toFixed(5)}, {terminal.lng.toFixed(5)}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Raio: {terminal.radius} km
                  </div>
              </div>

              <button 
                  onClick={() => handleDelete(terminal.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
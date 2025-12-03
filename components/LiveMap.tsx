import React, { useEffect, useRef, useState } from 'react';
import { LogisticsData } from '../types';
import * as L from 'leaflet';
import { MapPin, Radio, Navigation, Layers, Filter, Check, Search, X } from 'lucide-react';

interface Props {
  data: LogisticsData;
}

interface MapFilters {
  showTerminals: boolean;
  showGeofences: boolean;
  showFreeDrivers: boolean;
  showBusyDrivers: boolean;
}

export const LiveMap: React.FC<Props> = ({ data }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker | L.Circle }>({});
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MapFilters>({
    showTerminals: true,
    showGeofences: true,
    showFreeDrivers: true,
    showBusyDrivers: true,
  });

  const activeDrivers = data.drivers.filter(d => d.status === 'Ocupado');
  const freeDrivers = data.drivers.filter(d => d.status === 'Livre');

  // Helper to format plate (remove spaces and dashes)
  const formatPlate = (plate: string) => plate.replace(/[\s-]/g, '').toUpperCase();

  // Initialize Map
  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      // Create map instance centered on Santos/SP
      mapRef.current = L.map(containerRef.current).setView([-23.9469219, -46.333952], 13);

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers when data, filters, or search changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const cleanQuery = searchQuery.toUpperCase().replace(/[\s-]/g, '');

    // Custom Icons
    const terminalIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    const truckIconFree = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #22c55e; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
             </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const truckIconBusy = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #f97316; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
             </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    // --- 1. Terminals and Geofences ---
    data.terminals.forEach(terminal => {
      const markerId = `term-${terminal.id}`;
      const circleId = `circle-${terminal.id}`;

      // Search Logic for Terminals (Name match)
      const matchesSearch = cleanQuery === '' || terminal.name.toUpperCase().includes(cleanQuery);
      const showTerminal = filters.showTerminals && matchesSearch;

      // Handle Terminal Marker
      if (showTerminal) {
        if (!markersRef.current[markerId]) {
          const marker = L.marker([terminal.lat, terminal.lng], { icon: terminalIcon }).addTo(map);
          marker.bindPopup(`<b>${terminal.name}</b><br>Capacidade: ${terminal.capacity}`);
          
          // ADDED: Permanent Label for Terminal Name on Map
          marker.bindTooltip(terminal.name, {
            permanent: true,
            direction: 'bottom',
            className: 'text-xs font-bold text-blue-800 bg-white/90 border border-blue-200 px-1 rounded shadow-sm mt-2',
            offset: [0, 10]
          });

          markersRef.current[markerId] = marker;
        }
      } else {
        if (markersRef.current[markerId]) {
          markersRef.current[markerId].remove();
          delete markersRef.current[markerId];
        }
      }

      // Handle Geofence Circle (Also hides if search doesn't match terminal)
      if (filters.showGeofences && showTerminal) {
        if (!markersRef.current[circleId]) {
          const circle = L.circle([terminal.lat, terminal.lng], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
            radius: terminal.radius * 1000
          }).addTo(map);
          markersRef.current[circleId] = circle;
        } else {
           const circle = markersRef.current[circleId] as L.Circle;
           circle.setRadius(terminal.radius * 1000);
        }
      } else {
        if (markersRef.current[circleId]) {
          markersRef.current[circleId].remove();
          delete markersRef.current[circleId];
        }
      }
    });

    // --- 2. Drivers ---
    data.drivers.forEach(driver => {
      const markerId = `driver-${driver.id}`;
      const isFree = driver.status === 'Livre';
      const cleanPlate = formatPlate(driver.plate);
      
      // Search Logic: Check if Plate OR Name contains the query string
      const matchesSearch = cleanQuery === '' || 
                            cleanPlate.includes(cleanQuery) || 
                            driver.name.toUpperCase().includes(cleanQuery);

      const showDriver = (isFree ? filters.showFreeDrivers : filters.showBusyDrivers) && matchesSearch;

      if (showDriver) {
        const icon = isFree ? truckIconFree : truckIconBusy;

        if (markersRef.current[markerId]) {
          // Update existing
          const marker = markersRef.current[markerId] as L.Marker;
          marker.setLatLng([driver.currentLat, driver.currentLng]);
          marker.setIcon(icon);
          if (!marker.isPopupOpen()) {
             marker.setPopupContent(`<b>${driver.name}</b><br>Status: ${driver.status}<br>Placa: ${cleanPlate}`);
          }
          // If this specific driver matches exact search, bring to front
          if (cleanQuery.length > 3 && cleanPlate.includes(cleanQuery)) {
             marker.setZIndexOffset(1000);
          } else {
             marker.setZIndexOffset(0);
          }
        } else {
          // Create new
          const marker = L.marker([driver.currentLat, driver.currentLng], { icon: icon }).addTo(map);
          marker.bindPopup(`<b>${driver.name}</b><br>Status: ${driver.status}<br>Placa: ${cleanPlate}`);
          marker.bindTooltip(cleanPlate, {
            permanent: true,
            direction: 'top',
            className: 'driver-plate-label',
            offset: [0, -16]
          });
          markersRef.current[markerId] = marker;
        }
      } else {
        // Remove if filtered out or doesn't match search
        if (markersRef.current[markerId]) {
          markersRef.current[markerId].remove();
          delete markersRef.current[markerId];
        }
      }
    });

  }, [data, filters, searchQuery]);

  const toggleFilter = (key: keyof MapFilters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full flex flex-col p-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-blue-600" /> Mapa Operacional Integrado
          </h2>
          <p className="text-sm text-gray-500 hidden md:block">Visualização de terminais e frota em tempo real.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar placa ou terminal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-48 md:w-64 transition-all"
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

          <div className="relative">
             <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
             >
               <Filter size={16} />
               Filtros
             </button>

             {isFilterOpen && (
               <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[1000] p-2 animate-in fade-in slide-in-from-top-2">
                 <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Camadas</div>
                 
                 <button onClick={() => toggleFilter('showTerminals')} className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                     Terminais
                   </div>
                   {filters.showTerminals && <Check size={14} className="text-blue-600" />}
                 </button>

                 <button onClick={() => toggleFilter('showGeofences')} className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full border border-blue-400 bg-blue-100"></div>
                     Geofences (Raio)
                   </div>
                   {filters.showGeofences && <Check size={14} className="text-blue-600" />}
                 </button>

                 <div className="my-1 border-t border-gray-100"></div>
                 <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Frota</div>

                 <button onClick={() => toggleFilter('showBusyDrivers')} className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded bg-orange-500"></div>
                     Em Viagem
                   </div>
                   {filters.showBusyDrivers && <Check size={14} className="text-blue-600" />}
                 </button>

                 <button onClick={() => toggleFilter('showFreeDrivers')} className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded bg-green-500"></div>
                     Disponíveis
                   </div>
                   {filters.showFreeDrivers && <Check size={14} className="text-blue-600" />}
                 </button>
               </div>
             )}
          </div>

          <div className="flex items-center gap-2 text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full animate-pulse hidden lg:flex">
            <Radio size={14} />
            <span className="font-semibold">GPS On</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-100 rounded-xl shadow-inner border border-gray-200 overflow-hidden relative group">
        
        {/* Leaflet Map Container */}
        <div ref={containerRef} className="w-full h-full z-0" />

        {/* Live Driver List Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] w-72 hidden md:block">
          <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-slate-700">
             <div className="flex justify-between items-center mb-3">
               <h4 className="text-xs font-bold text-slate-400 uppercase">Frota Conectada (App)</h4>
               <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded text-white">
                 {/* Count visible drivers based on filters AND search */}
                 {data.drivers.filter(d => {
                    const cleanQuery = searchQuery.toUpperCase().replace(/[\s-]/g, '');
                    const cleanPlate = formatPlate(d.plate);
                    const matchesSearch = cleanQuery === '' || cleanPlate.includes(cleanQuery) || d.name.toUpperCase().includes(cleanQuery);
                    const matchesType = (d.status === 'Livre' && filters.showFreeDrivers) || (d.status !== 'Livre' && filters.showBusyDrivers);
                    return matchesSearch && matchesType;
                 }).length} Visíveis
               </span>
             </div>
             
             <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
               {data.drivers
                  .filter(d => {
                    const cleanQuery = searchQuery.toUpperCase().replace(/[\s-]/g, '');
                    const cleanPlate = formatPlate(d.plate);
                    const matchesSearch = cleanQuery === '' || cleanPlate.includes(cleanQuery) || d.name.toUpperCase().includes(cleanQuery);
                    const matchesType = (d.status === 'Livre' && filters.showFreeDrivers) || (d.status !== 'Livre' && filters.showBusyDrivers);
                    return matchesSearch && matchesType;
                  })
                  .map(driver => (
                 <div key={driver.id} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" 
                      onClick={() => {
                        if (mapRef.current) {
                          mapRef.current.flyTo([driver.currentLat, driver.currentLng], 15);
                        }
                      }}>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${driver.status === 'Livre' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-orange-400'}`}></div>
                       <div className="flex flex-col">
                         <span className="text-xs font-medium text-slate-200">{driver.name}</span>
                         <span className="text-[10px] font-bold text-yellow-400 border border-yellow-400/30 rounded px-1 inline-block w-fit mt-0.5">
                            {formatPlate(driver.plate)}
                         </span>
                       </div>
                    </div>
                    <div className="text-right">
                       <Navigation size={14} className="text-slate-400" />
                    </div>
                 </div>
               ))}
               
               {data.drivers.length > 0 && 
                 data.drivers.filter(d => {
                   const cleanQuery = searchQuery.toUpperCase().replace(/[\s-]/g, '');
                   const cleanPlate = formatPlate(d.plate);
                   return cleanQuery === '' || cleanPlate.includes(cleanQuery) || d.name.toUpperCase().includes(cleanQuery);
                 }).length === 0 && (
                   <p className="text-xs text-slate-500 text-center py-2">Nenhum motorista encontrado</p>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
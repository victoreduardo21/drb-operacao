import { LogisticsData, TripStatus } from './types';

// Data centered specifically on Santos/SP (approx -23.94, -46.33)
export const INITIAL_DATA: LogisticsData = {
  terminals: [
    { id: 'T1', name: 'Porto de Santos - Terminal 1', lat: -23.9615, lng: -46.3280, radius: 0.15, capacity: 200 },
    { id: 'T2', name: 'CD Retroporto Santos', lat: -23.9350, lng: -46.3500, radius: 0.1, capacity: 100 },
    { id: 'T3', name: 'Terminal Alemoa', lat: -23.9300, lng: -46.3650, radius: 0.08, capacity: 50 },
    { id: 'T4', name: 'Pátio Cubatão', lat: -23.8900, lng: -46.4200, radius: 0.2, capacity: 80 },
  ],
  drivers: [
    // Moving around the Port
    { id: 'D1', name: 'Carlos Silva', plate: 'GJC1J57', currentLat: -23.9550, currentLng: -46.3300, status: 'Ocupado', lastUpdate: new Date().toISOString() },
    // Near Centro
    { id: 'D2', name: 'Ana Oliveira', plate: 'RXQ9D22', currentLat: -23.9320, currentLng: -46.3250, status: 'Ocupado', lastUpdate: new Date().toISOString() },
    // Waiting at Alemoa
    { id: 'D3', name: 'Roberto Santos', plate: 'LOG5544', currentLat: -23.9310, currentLng: -46.3660, status: 'Livre', lastUpdate: new Date().toISOString() },
    // Coming from Cubatão
    { id: 'D4', name: 'Fernanda Lima', plate: 'TRK2023', currentLat: -23.9100, currentLng: -46.3900, status: 'Livre', lastUpdate: new Date().toISOString() },
  ],
  trips: [
    {
      id: 'TR-001',
      driverId: 'D1',
      originTerminalId: 'T2',
      destinationTerminalId: 'T1',
      customerName: 'Logística Baixada Santista',
      cargoType: 'Containers 40ft',
      status: TripStatus.IN_TRANSIT,
      createdAt: '2023-10-26T08:00:00Z',
      timeline: [
        { event: 'Iniciou Viagem', timestamp: '2023-10-26T08:15:00Z', location: 'App' },
        { event: 'Chegou na Origem', timestamp: '2023-10-26T09:00:00Z', location: 'CD Retroporto' },
        { event: 'Saiu para Entrega', timestamp: '2023-10-26T10:30:00Z', location: 'CD Retroporto' },
      ]
    },
    {
      id: 'TR-002',
      driverId: 'D2',
      originTerminalId: 'T1',
      destinationTerminalId: 'T3',
      customerName: 'Exportadora Global',
      cargoType: 'Eletrônicos',
      status: TripStatus.TO_ORIGIN,
      createdAt: '2023-10-26T11:00:00Z',
      timeline: [
        { event: 'Iniciou Viagem', timestamp: '2023-10-26T11:05:00Z', location: 'App' },
      ]
    },
    {
      id: 'TR-003',
      driverId: null,
      originTerminalId: 'T4',
      destinationTerminalId: 'T2',
      customerName: 'Varejo Litoral',
      cargoType: 'Vestuário',
      status: TripStatus.PENDING,
      createdAt: '2023-10-26T12:30:00Z',
      timeline: []
    }
  ]
};
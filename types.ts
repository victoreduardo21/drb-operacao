export enum TripStatus {
  PENDING = 'Pendente',
  TO_ORIGIN = 'Indo para Origem',
  AT_ORIGIN = 'Na Origem',
  IN_TRANSIT = 'Em Trânsito',
  AT_DESTINATION = 'No Destino',
  COMPLETED = 'Finalizado'
}

export interface Terminal {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in km
  capacity: number;
  city?: string;
  address?: string;
  cnpj?: string;
}

export interface Driver {
  id: string;
  name: string;
  plate: string; // Added license plate
  currentLat: number;
  currentLng: number;
  status: 'Livre' | 'Ocupado';
  lastUpdate: string;
}

export interface Trip {
  id: string;
  driverId: string | null;
  originTerminalId: string;
  destinationTerminalId: string;
  customerName: string;
  cargoType: string;
  status: TripStatus;
  createdAt: string;
  timeline: {
    event: string;
    timestamp: string;
    location: string;
  }[];
}

export interface LogisticsData {
  terminals: Terminal[];
  drivers: Driver[];
  trips: Trip[];
}
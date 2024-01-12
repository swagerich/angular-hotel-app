export interface ClientDto {
    id:number;
    name: string;
    phone: string;
    gender: string;
    dni: string;
    category: string;
    clientStatus: ClientStatus;
    bookings: number;
    revenue: number;
  }
  
  export enum ClientStatus {
    ACTIVE,
    INACTIVE,
  }
  
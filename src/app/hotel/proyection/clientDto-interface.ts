export interface ClientDto {
    id:number;
    name: string;
    phone: string;
    gender: string;
    dni: string;
    category: string;
    status: ClientStatus;
    bookings: number;
    revenue: number;  
  }
  
  export enum ClientStatus {
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
  }
  
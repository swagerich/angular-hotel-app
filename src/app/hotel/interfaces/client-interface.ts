export interface Client {
  id:number;
  name: string;
  phone: string;
  email:string;
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

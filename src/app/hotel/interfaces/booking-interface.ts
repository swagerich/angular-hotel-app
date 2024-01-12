import { Client } from './client-interface';
import { Room } from './room-interface';

export interface Booking {
  id?: number;
  checkInDate: Date;
  checkOutDate: Date;
  client: Client;
  room: Room;
}

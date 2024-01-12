import { Hotel } from './hotel-interface';
import { RoomStatus, RoomsType } from './roomType-interface';

export interface Room {
  id?: number;
  roomNumber: number;
  price: number;
  capacity: number;
  status: RoomStatus;
  roomType: RoomsType;
  hotel: Hotel;
}

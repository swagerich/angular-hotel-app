export interface RoomsType{
    id:number;
    name:string;
    description:string;
    status:RoomStatus;
}



export enum RoomStatus {
    AVAILABLE="AVAILABLE",
    OCCUPIED="OCCUPIED",
    MAINTENANCE="MAINTENANCE",
  }
  
export interface BookingDto {
    name:string;
    phone:string;
    id:number;
    checkInDate:Date;
    checkOutDate:Date;
    totalPrice:number;
    nroOfDays:number;
    roomNumber:number;
    dailyPrice:number
}
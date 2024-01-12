import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '../interfaces/booking-interface';
import { Observable } from 'rxjs';
import { BookingDto } from '../proyection/bookingDto-interface';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  #endPoint: string = 'http://localhost:8080/api/bookings';

  private http = inject(HttpClient);


  getBookings(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.#endPoint}`);
  }

  saveBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.#endPoint}`, booking);
  }
}

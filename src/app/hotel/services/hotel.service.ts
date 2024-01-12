import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Hotel } from '../interfaces/hotel-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  #endPoint: string = 'http://localhost:8080/api/hotels';

  private http = inject(HttpClient);


  saveHotel(hotel:Hotel) : Observable<Hotel>{
    return this.http.post<Hotel>(`${this.#endPoint}`,hotel);
  }

  getHotels() : Observable<Hotel[]>{
    return this.http.get<Hotel[]>(`${this.#endPoint}`);
  }
}

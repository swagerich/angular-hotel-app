import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Room } from '../interfaces/room-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  #endPoint: string = 'http://localhost:8080/api/rooms';

  private http = inject(HttpClient);

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.#endPoint}`);
  }

  saveRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.#endPoint}`, room);
  }
  updateRoom(room: Room,id:number): Observable<Room> {
    return this.http.put<Room>(`${this.#endPoint}/${id}`, room);
  }
}

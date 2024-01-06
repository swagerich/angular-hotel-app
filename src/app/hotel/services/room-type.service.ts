import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsType } from '../interfaces/roomType-interface';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  #endPoint: string = 'http://localhost:8080/api/room-types';

  private http = inject(HttpClient);

  getRoomsTypes() : Observable<RoomsType[]>{
    return this.http.get<RoomsType[]>(`${this.#endPoint}`);
  }

  saveRoomType(roomType:RoomsType) : Observable<RoomsType>{
    return this.http.post<RoomsType>(`${this.#endPoint}`, roomType);
  }

  updateRoomType(roomType:RoomsType,id:number) : Observable<RoomsType>{
    return this.http.put<RoomsType>(`${this.#endPoint}/${id}`, roomType);
  }
}

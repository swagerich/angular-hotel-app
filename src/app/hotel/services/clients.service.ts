import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { ClientDto } from '../interfaces/client-interface';
import { toSignal,toObservable } from  '@angular/core/rxjs-interop';
import { Observable, delay, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  
  #endPoint: string = 'http://localhost:8080/api/clients';

  private http = inject(HttpClient);

  //  getClients(): Signal<ClientDto[]> {
  //   const clients$ = this.http.get<ClientDto[]>(`${this.#endPoint}`).pipe(
  //     delay(2000)
  //   );
  //   return toSignal(clients$,{initialValue:[] as ClientDto[]});
  // }

  getClients(): Observable<ClientDto[]> {
      return this.http.get<ClientDto[]>(`${this.#endPoint}`).pipe(
        delay(2000)
      );
    }

   saveClient(client:ClientDto) : Observable<ClientDto>{
    return this.http.post<ClientDto>(`${this.#endPoint}`, client);
  }

  getClientById(id:number): Observable<ClientDto>{
    return this.http.get<ClientDto>(`${this.#endPoint}/${id}`);
  }

   deleteClientById(id:number): Observable<void>{
    return this.http.delete<void>(`${this.#endPoint}/${id}`);
  }

   updateClient(client:ClientDto, id:number){
    return this.http.put<ClientDto>(`${this.#endPoint}/${id}`, client);
  }
}


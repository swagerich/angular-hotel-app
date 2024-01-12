import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Client } from '../interfaces/client-interface';
import { Observable, delay, of, tap } from 'rxjs';
import { ClientDto } from '../proyection/clientDto-interface';
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

   saveClient(client:Client) : Observable<Client>{
    return this.http.post<Client>(`${this.#endPoint}`, client);
  }

  getClientById(id:number): Observable<Client>{
    return this.http.get<Client>(`${this.#endPoint}/${id}`);
  }

   deleteClientById(id:number): Observable<void>{
    return this.http.delete<void>(`${this.#endPoint}/${id}`);
  }

   updateClient(client:Client, id:number){
    return this.http.put<Client>(`${this.#endPoint}/${id}`, client);
  }
}


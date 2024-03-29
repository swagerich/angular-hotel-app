import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
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

  deleteAllClientById(ids:number[]): Observable<void>{
    const params = new HttpParams().set('ids', ids.join(','));
    console.log(params)
    return this.http.delete<void>(`${this.#endPoint}/delete-all`,{
      headers:{
        'Content-Type':'x-www-form-urlencoded'
      },
      params:params
    });
  }

  exportJson(ids:number[]): Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<Blob>(`${this.#endPoint}/download?ids=${ids}`, {
      headers:headers,
      responseType: 'blob' as 'json'
    });
  }

  getCountClientsByDates(starDate:string,lastDate:string) : Observable<any>{
    return this.http.get<any>(`${this.#endPoint}/counts-users-by-date?start-date=${starDate}&last-date=${lastDate}`);
  }

}


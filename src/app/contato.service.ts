import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from './contato/contato';
import { Observable } from 'rxjs';
import { API_CONFIG } from './config/api-config';
import { PaginaContato } from './contato/paginaContato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  constructor(private http: HttpClient) {

   }
   
   save(contato: Contato): Observable<Contato>{
    return this.http.post<Contato>(`${API_CONFIG.baseUrl}/insert`, contato);
   }

   list(page: number, pageSize: number): Observable<PaginaContato>{
    const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);
    return this.http.get<any>(`${API_CONFIG.baseUrl}?${params.toString()}`);
   }

   favorite(id: any, favorito: boolean): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseUrl}/${id}/favorito`, favorito);
   }

   upload(contato: Contato, formData: FormData): Observable<any>{
    return this.http.put(`${API_CONFIG.baseUrl}/${contato.id}/foto`, formData, {responseType: 'blob'}); //blob representa que é um array de byte
   }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaDesejoService {
  private apiUrl = 'http://localhost:8080/clientes'; 

  constructor(private http: HttpClient) {}

  getListaDeDesejos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/desejos`);
  }

  addToListaDeDesejos(processadorId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add/desejos/${processadorId}`, {});
  }

  removeFromListaDeDesejos(processadorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/desejos/${processadorId}`);
  }
}
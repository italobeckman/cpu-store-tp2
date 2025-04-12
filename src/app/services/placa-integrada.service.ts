import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PlacaIntegrada } from '../models/placa-integrada.model';

interface PageResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class PlacaIntegradaService {
  private baseUrl: string = 'http://localhost:8080/placasintegradas';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<PlacaIntegrada[]> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          page_size: pageSize.toString()
        };
      }
  
      return this.httpClient.get<PlacaIntegrada[]>(this.baseUrl, { params })
        .pipe(
          tap(data => console.log('Placas graficas retornados da API:', data))
        );
    }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<PlacaIntegrada> {
    return this.httpClient.get<PlacaIntegrada>(`${this.baseUrl}/${id}`);
  }

  insert(placaIntegrada: PlacaIntegrada): Observable<PlacaIntegrada> {
    return this.httpClient.post<PlacaIntegrada>(`${this.baseUrl}/create`, placaIntegrada);
  }

  update(id: number, placaIntegrada: PlacaIntegrada): Observable<any> {
    return this.httpClient.put<PlacaIntegrada>(`${this.baseUrl}/${id}`, placaIntegrada);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }
}
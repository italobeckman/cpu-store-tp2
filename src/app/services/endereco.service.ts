import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl: string = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  findAll(page?: number, pageSize?: number): Observable<Endereco[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }

    return this.httpClient.get<Endereco[]>(`${this.baseUrl}/usuarios`, { params })
      .pipe(
        tap(data => console.log('Endereços retornados da API:', data))
      );
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`, { headers: this.getAuthHeaders() });
  }

  findById(id: number): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Endereço detalhado:', data))
      );
  }

  insert(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(this.baseUrl, endereco, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Endereço criado:', data))
      );
  }

  update(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put<Endereco>(`${this.baseUrl}/${endereco.id}`, endereco, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Endereço atualizado:', data))
      );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log('Endereço excluído'))
      );
  }

  findByCep(cep: string): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(`${this.baseUrl}/search?cep=${cep}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Endereços encontrados pelo CEP:', data))
      );
  }
}
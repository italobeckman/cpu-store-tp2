import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl: string = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Endereco[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }

    return this.httpClient.get<Endereco[]>(this.baseUrl, { params })
      .pipe(
        tap(data => console.log('Endereços retornados da API:', data))
      );
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(data => console.log('Endereço detalhado:', data))
      );
  }

  insert(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(this.baseUrl, endereco)
      .pipe(
        tap(data => console.log('Endereço criado:', data))
      );
  }

  update(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put<Endereco>(`${this.baseUrl}/${endereco.id}`, endereco)
      .pipe(
        tap(data => console.log('Endereço atualizado:', data))
      );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => console.log('Endereço excluído'))
      );
  }

  // Optional method to search by CEP
  findByCep(cep: string): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(`${this.baseUrl}/search?cep=${cep}`)
      .pipe(
        tap(data => console.log('Endereços encontrados pelo CEP:', data))
      );
  }
}
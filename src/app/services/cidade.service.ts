import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private baseUrl: string = 'http://localhost:8080/cidades';

  constructor(private http: HttpClient) { }

  findById(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.baseUrl}/search/${nome}`);
  }

  findAll(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.baseUrl);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  create(cidade: Cidade): Observable<Cidade> {
    return this.http.post<Cidade>(this.baseUrl, cidade);
  }

  update(id: number, cidade: Cidade): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, cidade);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
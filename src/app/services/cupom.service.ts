import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cupom } from '../models/cupom.model';

@Injectable({
  providedIn: 'root'
})
export class CupomService {
  private baseUrl: string = 'http://localhost:8080/cupons';

  constructor(private http: HttpClient) { }

  findById(id: number): Observable<Cupom> {
    return this.http.get<Cupom>(`${this.baseUrl}/${id}`);
  }

  findByCodigo(codigo: string): Observable<Cupom> {
    return this.http.get<Cupom>(`${this.baseUrl}/codigo/${codigo}`);
  }

  findAll(): Observable<Cupom[]> {
    return this.http.get<Cupom[]>(this.baseUrl);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  create(cupom: Cupom): Observable<Cupom> {
    return this.http.post<Cupom>(this.baseUrl, cupom);
  }

  update(id: number, cupom: Cupom): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, cupom);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

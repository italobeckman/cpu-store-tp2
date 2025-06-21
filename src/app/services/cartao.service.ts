import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cartao, CartaoRetorno } from '../models/cartao.model';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private baseUrl: string = 'http://localhost:8080/cartoes';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<CartaoRetorno[]> {
    let params = new HttpParams();

    if (page !== undefined && pageSize !== undefined) {
      params = params
        .set('page', page.toString())
        .set('page_size', pageSize.toString());
    }

    return this.httpClient.get<CartaoRetorno[]>(`${this.baseUrl}/usuarios`, { params }).pipe(
      tap(cartoes => console.log('Cartões retornados:', cartoes))
    );
  }

  findById(id: number): Observable<Cartao> {
    return this.httpClient.get<Cartao>(`${this.baseUrl}/${id}`);
  }

  create(cartao: Cartao): Observable<Cartao> {
    return this.httpClient.post<Cartao>(this.baseUrl+"/create", cartao).pipe(
      tap(novo => console.log('Cartão criado:', novo))
    );
  }

  update(id: number, cartao: Cartao): Observable<Cartao> {
    return this.httpClient.put<Cartao>(`${this.baseUrl}/${id}`, cartao).pipe(
      tap(atualizado => console.log('Cartão atualizado:', atualizado))
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => console.log(`Cartão com ID ${id} removido`))
    );
  }
}

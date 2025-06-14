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

  // FUNÇÕES ADICIONAIS ÚTEIS

  /**
   * Valida se um cupom pode ser aplicado, por exemplo, checando validade e uso.
   * Retorna o cupom se válido ou erro se inválido.
   */
  validarCupom(codigo: string): Observable<Cupom> {
    return this.http.get<Cupom>(`${this.baseUrl}/validar/${codigo}`);
  }

  /**
   * Aplica o cupom ao pedido - caso seu backend tenha essa lógica.
   * Recebe id do pedido e id do cupom, e faz a aplicação.
   */
  aplicarCupomPedido(pedidoId: number, cupomId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/aplicar/${pedidoId}/${cupomId}`, null);
  }
}

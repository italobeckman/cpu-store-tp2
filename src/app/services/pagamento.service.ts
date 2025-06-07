import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private readonly baseUrl = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient) {}

  findById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  generatePix(pedidoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/pix/${pedidoId}`, null);
  }

  generateBoleto(pedidoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/boleto/${pedidoId}`, null);
  }

  pagarComCartao(cartaoId: number, pedidoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cartao/${cartaoId}/${pedidoId}`, null);
  }

  pagarComBoleto(pedidoId: number, boletoId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${pedidoId}/boleto/${boletoId}`, null);
  }

  pagarComPix(pedidoId: number, pixId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${pedidoId}/pix/${pixId}`, null);
  }
}

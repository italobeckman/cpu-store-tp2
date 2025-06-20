import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private baseUrl = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient) {}

  pagarComPix(pedidoId: number, idPix: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/pix/${pedidoId}/${idPix}`, null);
  }

  pagarComBoleto(pedidoId: number, idBoleto: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/boleto/${pedidoId}/${idBoleto}`, null);
  }

  pagarComCartao(idCartao?: number, pedidoId?: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cartao/${idCartao}/${pedidoId}`, null);
  }

  generatePix(pedidoId: number): Observable<any> {
    console.log("pix")
    return this.http.post(`${this.baseUrl}/pix/${pedidoId}`, null);
  }

  generateBoleto(pedidoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/boleto/${pedidoId}`, null);
  }

  criarSessaoStripe(pedidoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/stripe/${pedidoId}`, null);
  }
}

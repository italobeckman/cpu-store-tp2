import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PedidoRequest,
  PedidoResponse,
} from '../models/pedido.model'; // ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private baseUrl: string = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Realiza um novo pedido
   */
  createPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.baseUrl, pedido, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Lista pedidos do usuário autenticado
   */
  listPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/meus-pedidos`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Obtém os detalhes de um pedido específico
   */
  getPedidoById(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Cancela um pedido
   */
  cancelarPedido(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/cancelar`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Confirma o recebimento do pedido
   */
  confirmarRecebimento(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/confirmar-recebimento`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Realiza novamente um pedido anterior
   */
  comprarNovamente(id: number): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.baseUrl}/${id}/comprar-novamente`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Rastreia um pedido
   */
  rastrearPedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/rastreamento`, {
      headers: this.getAuthHeaders(),
    });
  }
}

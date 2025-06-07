import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoBasicResponseDTO {
  id: number;
  data: string; 
  valorTotal: number;
  formaPagamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  listarPedidos(): Observable<PedidoBasicResponseDTO[]> {
    return this.http.get<PedidoBasicResponseDTO[]>(`${this.apiUrl}/lista`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoBasicResponseDTO {
  id: number;
  data: string;
  valorTotal: number;
  statusPedido: string;
  formaPagamento: string;
  listaItemPedido: {
    idProcessador: number;
    nome: string;
    quantidade: number;
    valor: number;
    imageUrl?: string[];
  }[];
  enderecoEntrega?: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: {
      nome: string;
      estado: {
        nome: string;
      };
    };
    cep: string;
  };
}


@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  listarPedidos(): Observable<PedidoBasicResponseDTO[]> {
    return this.http.get<PedidoBasicResponseDTO[]>(`${this.apiUrl}/lista`);
  }

  cancelarPedido(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/cancelar/${id}`, {});
  }


}

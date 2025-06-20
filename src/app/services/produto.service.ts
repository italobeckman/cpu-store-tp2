import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = 'http://localhost:8080/processadores/filtro';

  constructor(private http: HttpClient) {}

  buscarPorFiltro(filtro: any) {
    let params = new HttpParams();
    if (filtro.nome) params = params.set('nome', filtro.nome);
    if (filtro.fabricante.length) params = params.set('fabricante', filtro.fabricante.join(','));
    if (filtro.frequenciaMin) params = params.set('frequenciaMin', filtro.frequenciaMin);
    if (filtro.frequenciaMax) params = params.set('frequenciaMax', filtro.frequenciaMax);
    if (filtro.precoMin) params = params.set('precoMin', filtro.precoMin);
    if (filtro.precoMax) params = params.set('precoMax', filtro.precoMax);
    filtro.socket.forEach((s: string) => params = params.append('socket', s));
    filtro.nucleos.forEach((n: string) => params = params.append('nucleos', n));
    return this.http.get(this.apiUrl, { params });
  }
}
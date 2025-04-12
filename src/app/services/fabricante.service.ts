import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Fabricante } from '../models/fabricante.model';
import { Telefone } from '../models/telefone';
import { TelefoneService } from './telefone.service';
import { FabricanteParaRetorno } from '../models/fabricante_para_retorno';
import { FabricanteParaInserir } from '../models/fabricante_para_inserir';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
  private baseUrl: string = 'http://localhost:8080/fabricantes';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Fabricante[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }

    return this.httpClient.get<Fabricante[]>(this.baseUrl, { params }).pipe(
      tap(data => console.log('fabricantes retornados da API:', data))
    );
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  delete(fabricante: Fabricante): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${fabricante.id}`);
  }

  insert(fabricante: Fabricante): Observable<Fabricante> {
    const telefone: Telefone = TelefoneService.converteStringToTelefone(fabricante.telefone);

    const fabricanteParaInserir: FabricanteParaInserir = {
      telefone: telefone,
      nome: fabricante.nome,
      email: fabricante.email
    };

    return this.httpClient.post<Fabricante>(this.baseUrl, fabricanteParaInserir);
  }

  update(fabricante: Fabricante): Observable<any> {
    const telefone: Telefone = TelefoneService.converteStringToTelefone(fabricante.telefone);

    const fabricanteParaAtualizar: FabricanteParaInserir = {
      telefone: telefone,
      nome: fabricante.nome,
      email: fabricante.email
    };

    return this.httpClient.put(`${this.baseUrl}/${fabricante.id}`, fabricanteParaAtualizar);
  }

  findById(id: string): Observable<Fabricante> {
    return this.httpClient.get<Fabricante>(`${this.baseUrl}/${id}`)
    }
}

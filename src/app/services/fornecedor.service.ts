import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';
import { Telefone } from '../models/telefone';
import { TelefoneService } from './telefone.service';
import { FornecedorParaInserir } from '../models/fornecedor_para_inserir';
import { FornecedorParaRetorno } from '../models/fornecedor_para_retorno';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private baseUrl: string = 'http://localhost:8080/fornecedores';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Fornecedor[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }

    return this.httpClient.get<Fornecedor[]>(this.baseUrl, { params })
      .pipe(
        tap(data => console.log('fornecedores retornados da API:', data))
      );
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<Fornecedor>(`${this.baseUrl}/${fornecedor.id}`);
  }

  insert(fornecedor: Fornecedor): Observable<Fornecedor> {
    const telefone: Telefone =  TelefoneService.converteStringToTelefone(fornecedor.telefone)

    const fornecedorParaInserir: FornecedorParaInserir = {
      telefone: telefone,
      nome: fornecedor.nome,
      email: fornecedor.email,
    } 

    return this.httpClient.post<Fornecedor>(this.baseUrl, fornecedorParaInserir);
  }
  
  update(fornecedor: Fornecedor): Observable<any> {
    const telefone: Telefone =  TelefoneService.converteStringToTelefone(fornecedor.telefone)

    const fornecedorParaAtualizar: FornecedorParaInserir = {
      telefone: telefone,
      nome: fornecedor.nome,
      email: fornecedor.email,
    } 
    return this.httpClient.put<Fornecedor>(`${this.baseUrl}/${fornecedor.id}`, fornecedorParaAtualizar);
  }
  
  findById(id: string): Observable<Fornecedor> {
    
    return this.httpClient.get<FornecedorParaRetorno>(`${this.baseUrl}/${id}`).pipe(
      map(data => {
        const fornecedor = new Fornecedor();
        fornecedor.id = data.id || NaN;
        fornecedor.nome = data.nome;
        fornecedor.email = data.email;
        fornecedor.telefone = TelefoneService.converteTelefoneToString(data.telefone);
        console.log(data.telefone)
        return fornecedor;
      }),
      catchError(error => {
        console.error('Erro ao buscar fornecedor:', error);
        return throwError(() => new Error('Erro ao carregar fornecedor'));
      })
    );
  }
}

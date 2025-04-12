import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Estado } from '../models/estado.model';
import { Funcionario } from '../models/Funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {
  private baseUrl: string = 'http://localhost:8080/funcionarios';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Estado[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }

    return this.httpClient.get<Estado[]>(this.baseUrl, { params })
      .pipe(
        tap(data => console.log('Estados retornados da API:', data))
      );
  }

  findByUserName(username: string): Observable<Funcionario>{
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/findByUserName/${username}`)
  }

}
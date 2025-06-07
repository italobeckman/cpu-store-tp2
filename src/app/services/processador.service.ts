import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, tap, throwError } from 'rxjs';
import { Processador } from '../models/processador.model';

import { catchError } from 'rxjs/operators';

interface PageResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ProcessadorService {
  private baseUrl: string = 'http://localhost:8080/processadores';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Processador[]> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          page_size: pageSize.toString()
        };
      }
  
      return this.httpClient.get<Processador[]>(this.baseUrl, { params })
        .pipe(
          tap(data => console.log('Placas graficas retornados da API:', data))
        );
    }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Processador> {
    return this.httpClient.get<Processador>(`${this.baseUrl}/${id}`);
  }

  insert(processador: Processador): Observable<Processador> {
    // Cria uma cópia do processador para manipular sem afetar o original
    const processadorRequest = this.prepareRequestData(processador);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('Enviando para API:', JSON.stringify(processadorRequest, null, 2));
    
    return this.httpClient.post<Processador>(
      `${this.baseUrl}/create`, 
      processadorRequest, 
      { headers }
    );
  }

  update(id: number, processador: Processador): Observable<any> {
    // Usa o mesmo método para preparar os dados que já existe para o insert
    const processadorRequest = this.prepareRequestData(processador);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('Enviando para API (update):', JSON.stringify(processadorRequest, null, 2));
    
    return this.httpClient.put<Processador>(
      `${this.baseUrl}/${id}`, 
      processadorRequest, 
      { headers }
    );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }
  /**
   * Prepara os dados para envio à API, tratando nulos, tipos e referências circulares
   */
  private prepareRequestData(processador: Processador): any {
    // Cria uma cópia profunda para evitar modificar o original
    const processadorCopy = JSON.parse(JSON.stringify(processador));
    
    // Trata a placa integrada (envia apenas o ID se for um objeto)
    if (processadorCopy.placaIntegrada && typeof processadorCopy.placaIntegrada === 'object') {
      processadorCopy.placaIntegrada = processadorCopy.placaIntegrada.id;
    }
    
    // Garante que campos numéricos sejam números (não strings)
    if (processadorCopy.threads) processadorCopy.threads = +processadorCopy.threads;
    if (processadorCopy.nucleos) processadorCopy.nucleos = +processadorCopy.nucleos;
    if (processadorCopy.preco) processadorCopy.preco = +processadorCopy.preco;
    if (processadorCopy.fabricante) processadorCopy.fabricante = +processadorCopy.fabricante;
    
    // Trata a memória cache
    if (processadorCopy.memoriaCache) {
      processadorCopy.memoriaCache.l1 = 
        processadorCopy.memoriaCache.l1 === '' || processadorCopy.memoriaCache.l1 === undefined 
          ? null 
          : +processadorCopy.memoriaCache.l1;
          
      processadorCopy.memoriaCache.l2 = 
        processadorCopy.memoriaCache.l2 === '' || processadorCopy.memoriaCache.l2 === undefined 
          ? null 
          : +processadorCopy.memoriaCache.l2;
          
      processadorCopy.memoriaCache.l3 = 
        processadorCopy.memoriaCache.l3 === '' || processadorCopy.memoriaCache.l3 === undefined 
          ? null 
          : +processadorCopy.memoriaCache.l3;
    }
    
    // Trata a frequência
    if (processadorCopy.frequencia) {
      processadorCopy.frequencia.base = +processadorCopy.frequencia.base;
      processadorCopy.frequencia.turbo = 
        processadorCopy.frequencia.turbo === '' || processadorCopy.frequencia.turbo === undefined 
          ? null 
          : +processadorCopy.frequencia.turbo;
    }
    
    // Trata o consumo energético
    if (processadorCopy.consumoEnergetico) {
      processadorCopy.consumoEnergetico.tdp = +processadorCopy.consumoEnergetico.tdp;
    }
    
    return processadorCopy;
  }

  public getImageUrl(nomeImagem: string): string {
    return `${this.baseUrl}/download/imagem/${nomeImagem}`;
  }

  public uploadImagem(file: File, id: number): Observable<any> {
    // 1. Validação do tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        return throwError(() => new Error('Tipo de arquivo não suportado. Use PNG ou JPEG.'));
    }

    // 2. Preparar FormData CORRETAMENTE
    const formData = new FormData();
    // Adiciona o nome do arquivo (como espera o back-end)
    formData.append('nomeImagem', file.name); 
    // Adiciona o arquivo com o nome de campo EXATO que o back-end espera
    formData.append('imagem', file, file.name); // O terceiro parâmetro é importante

    // 3. Verificação no console (para debug)
    // Isso mostra os dados que estão sendo enviados
    formData.forEach((value, key) => {
        console.log(key, value);
    });

    // 4. Fazer a requisição PATCH sem headers manuais
    // O Angular vai automaticamente configurar o Content-Type correto
    // com o boundary necessário para multipart/form-data
    return this.httpClient.patch(
        `${this.baseUrl}/${id}/upload/imagem`,
        formData
    ).pipe(
        catchError(error => {
            console.error('Erro completo no upload:', error);
            // Mensagem mais detalhada para o usuário
            let errorMsg = 'Erro desconhecido no upload';
            if (error.status === 413) {
                errorMsg = 'Arquivo muito grande';
            } else if (error.status === 415) {
                errorMsg = 'Tipo de arquivo não suportado';
            }
            return throwError(() => new Error(errorMsg));
        })
    );
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

export interface PerfilUsuario {
  id: number;
  username: string;
  email: string;
  cpf: string;
  dataCriacao: Date;
  dataNascimento: Date;
  telefone: {
    codigoArea: string;
    numero: string;
  };
  enderecos?: any[];
  perfil: string;
  nomeImagem?: string;
}
export interface CartaoRequestDTO {
  nomeTitular: string;
  numero: string;
  cpf: string;
  validade: string;
  cvc: number;
  tipoCartao: number;
}

export interface CartaoResponseDTO {
  id: number;
  nomeTitular: string;
  numero: string;
  cpf: string;
  validade: string;
  tipoCartao: string;
}

export interface EnderecoRequestDTO {
  logradouro: string;
  cep: string;
  bairro: string;
  complemento?: string;
  numero: number;
  idCidade: number;
}

export interface EnderecoResponseDTO {
  id: number;
  logradouro: string;
  cep: string;
  bairro: string;
  complemento?: string;
  numero: number;
  cidade: {
    id: number;
    nome: string;
    estado: {
      id: number;
      nome: string;
      sigla: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private baseUrl: string = 'http://localhost:8080/usuarios';
  private cartaoUrl: string = 'http://localhost:8080/cartoes';
  private enderecoUrl: string = 'http://localhost:8080/enderecos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getAuthHeadersForUpload(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    // Não defina Content-Type aqui!
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Busca o perfil do usuário logado
   */
  getMeuPerfil(): Observable<PerfilUsuario> {
    console.log(
      'Enviando requisição GET para:',
      `${this.baseUrl}/meu-perfil`,
      'com headers:',
      this.getAuthHeaders()
    );
    console.log(this.getAuthHeaders());

    return this.http.get<PerfilUsuario>(`${this.baseUrl}/meu-perfil`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Faz upload da imagem de perfil
   */
  uploadImagemPerfil(file: File, nomeImagem: string): Observable<void> {
    const formData = new FormData();
    formData.append('nomeImagem', nomeImagem);
    formData.append('imagem', file, file.name);

    return this.http.patch<void>(`${this.baseUrl}/upload/imagem`, formData, {
      headers: this.getAuthHeadersForUpload(),
    });
  }

  public getImageUrl(nomeImagem: string): string {
    return `${this.baseUrl}/download/imagem/${nomeImagem}`;
  }

  /**
   * Cria um novo cartão
   */
  createCartao(cartao: CartaoRequestDTO): Observable<CartaoResponseDTO> {
    return this.http.post<CartaoResponseDTO>(`${this.cartaoUrl}/create`, cartao, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Lista cartões do usuário autenticado
   */
  listCartoesByUser(): Observable<CartaoResponseDTO[]> {
    return this.http.get<CartaoResponseDTO[]>(`${this.cartaoUrl}/usuarios`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Atualiza um cartão
   */
  updateCartao(id: number, cartao: CartaoRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.cartaoUrl}/update/${id}`, cartao, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Deleta um cartão
   */
  deleteCartao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.cartaoUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Lista endereços do usuário logado
   */
  listEnderecosByUser(): Observable<EnderecoResponseDTO[]> {
    return this.http.get<EnderecoResponseDTO[]>(
      `${this.enderecoUrl}/usuarios`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  /**
   * Cria um novo endereço
   */
  createEndereco(
    endereco: EnderecoRequestDTO
  ): Observable<EnderecoResponseDTO> {
    return this.http.post<EnderecoResponseDTO>(this.enderecoUrl, endereco, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Atualiza um endereço
   */
  updateEndereco(id: number, endereco: EnderecoRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.enderecoUrl}/${id}`, endereco, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Deleta um endereço
   */
  deleteEndereco(id: number): Observable<void> {
    return this.http.delete<void>(`${this.enderecoUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  atualizarDadosPessoais(data: any) {
    return this.http.put(`${this.baseUrl}/edit-perfil`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}

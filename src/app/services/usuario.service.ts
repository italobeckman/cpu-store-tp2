import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, tap, throwError } from 'rxjs';
import { Estado } from '../models/estado.model';
import { Usuario } from '../models/usuario.model';
import { UsuarioParaInserir } from '../models/usuario_para_inserir.model';
import { UsuarioParaRetorno } from '../models/usuario_para_retorno.model';
import { TelefoneService } from './telefone.service';
import { UsuarioFuncionario } from '../models/UsuarioFuncionario.models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl: string = 'http://localhost:8080/usuarios';
  private baseUrlFuncionarios: string = 'http://localhost:8080/funcionarios'

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Usuario[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        size: pageSize.toString()
      };
    }

    return this.httpClient.get<Usuario[]>(this.baseUrl, { params })
      .pipe(
        tap(data => console.log('Usuários retornados da API:', data))
      );
  }


  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

 

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  findByUsernameAndSenha(usuario: Usuario): Observable<UsuarioParaRetorno> {
    return this.httpClient.get<UsuarioParaRetorno>(`${this.baseUrl}/findByUsernameAndSenha/${usuario.username}/${usuario.senha}`);
  }

  findByUsernameAndSenhaStr(username: string, senha: string): Observable<UsuarioParaRetorno> {
    return this.httpClient.get<UsuarioParaRetorno>(`${this.baseUrl}/findByUsernameAndSenha/${username}/${senha}`);
  }

  findByCpf(usuario: Usuario): Observable<UsuarioParaRetorno> {
    return this.httpClient.get<UsuarioParaRetorno>(`${this.baseUrl}/findByCpf/${usuario.cpf}`)
  }

  findByCpfS(cpf: string): Observable<UsuarioParaRetorno> {
    const user = this.httpClient.get<UsuarioParaRetorno>(`${this.baseUrl}/findByCpf/${cpf}`)
    console.log(user)
    return user 
  }


  async insert(usuario: Usuario): Promise<Observable<UsuarioParaRetorno>> {
    switch (usuario.categoria) {
      case "ADMIN":
        try {
          const usuarioBuscado = await firstValueFrom(this.findByCpf(usuario));
  
          if (usuarioBuscado) {
            console.log("Usuário já existente");
            const usuarioParaInserirFuncionario: UsuarioFuncionario = {
              cargo: usuario.cargo,
              salaraio: usuario.salario, 
            };
  
            return this.httpClient.post<UsuarioParaRetorno>(
              `${this.baseUrlFuncionarios}/${usuarioBuscado.id}`,
              usuarioParaInserirFuncionario
            );
          }
        } catch (e) {
          console.log("Usuário não encontrado, será criado um novo.");
        }
  
        const usuarioParaInserir: UsuarioParaInserir = {
          username: usuario.username,
          email: usuario.email,
          senha: usuario.senha,
          dataNascimento: usuario.dataNascimento,
          cpf: usuario.cpf,
          telefone: TelefoneService.converteStringToTelefone(usuario.telefone),
        };
  
        try {
          const usuarioCriado = await firstValueFrom(
            this.httpClient.post<UsuarioParaRetorno>(this.baseUrl, usuarioParaInserir)
          );
  
          const usuarioParaInserirFuncionario: UsuarioFuncionario = {
            cargo: usuario.cargo,
            salaraio: usuario.salario, 
          };
  
          return this.httpClient.post<UsuarioParaRetorno>(
            `${this.baseUrlFuncionarios}/${usuarioCriado.id}`,
            usuarioParaInserirFuncionario
          );
        } catch (error: any) {
          let errorMessage = 'Erro ao cadastrar usuário';
          
          if (error.error?.details?.includes('usuario_cpf_key')) {
            errorMessage = 'CPF já cadastrado no sistema';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          return throwError(() => ({
            message: errorMessage,
            details: error.error?.details,
            originalError: error
          }));
        }
  
      case "USER":
        const usuarioParaInserirCliente: UsuarioParaInserir = {
          username: usuario.username,
          email: usuario.email,
          senha: usuario.senha,
          dataNascimento: usuario.dataNascimento,
          cpf: usuario.cpf,
          telefone: TelefoneService.converteStringToTelefone(usuario.telefone),
        };
  
        try {
          return this.httpClient.post<UsuarioParaRetorno>(this.baseUrl, usuarioParaInserirCliente);
        } catch (error: any) {
          let errorMessage = 'Erro ao cadastrar cliente';
          
          if (error.error?.details?.includes('usuario_cpf_key')) {
            errorMessage = 'CPF já cadastrado no sistema';
          }
          
          return throwError(() => ({
            message: errorMessage,
            details: error.error?.details,
            originalError: error
          }));
        }
  
      default:
        return throwError(() => ({
          message: 'Categoria de usuário inválida',
          details: 'A categoria deve ser ADMIN ou USER'
        }));
    }
  } 

  update(usuario: Usuario): Observable<any> {
    return this.httpClient.put<Estado>(`${this.baseUrl}/${usuario.id}`, usuario);
  }

  delete(usuario: Usuario): Observable<any> {
    return this.httpClient.delete<Estado>(`${this.baseUrl}/${usuario.id}`);
  }

}
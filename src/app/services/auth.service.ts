import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../models/usuario.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initUsuarioLogado();
  }

  private initUsuarioLogado() {
    try {
      const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
      if (usuario) {
        const usuarioLogado = JSON.parse(usuario);
        this.setUsuarioLogado(usuarioLogado);
        this.usuarioLogadoSubject.next(usuarioLogado);
      }
    } catch (error) {
      console.error('Erro ao inicializar o usuário logado:', error);
      this.usuarioLogadoSubject.next(null);
    }
  }

  setUsuarioLogado(usuario: Usuario): void {
    try {
      const usuarioString = JSON.stringify(usuario);
      this.localStorageService.setItem(this.usuarioLogadoKey, usuarioString);
    } catch (error) {
      console.error('Erro ao salvar o usuário logado:', error);
    }
  }

  loginADM(username: string, senha: string): Observable<any> {
    const params = {
      username: username,
      senha: senha,
    };
    return this.http
      .post(`${this.baseURL}`, params, {
        observe: 'response',
        responseType: 'json', // agora espera JSON
      })
      .pipe(
        tap((res: any) => {
          // O corpo da resposta agora é um objeto JSON
          const body = res.body;
          if (body && body.token) {
            this.setToken(body.token);
            // Salva o username no localStorage
            this.localStorageService.setItem('username', body.username);
            // Atualize o usuário logado se necessário
            this.usuarioLogadoSubject.next(null);
          }
        })
      );
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  getUsername(): string | null {
    return this.localStorageService.getItem('username');
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.localStorageService.removeItem('username');
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Token inválido ou expirado', error);
      return true;
    }
  }
}

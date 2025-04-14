import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UsuarioService } from './usuario.service';

interface PageResponse<T> {
  page: number;
  pageSize: number;
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl: string = 'http://localhost:8080/auth';

  constructor(private httpClient: HttpClient, private userService: UsuarioService) { }

  verify(username: string, password: string): Observable<boolean> {
    return this.userService.findByUsernameAndSenhaStr(username, password).pipe(
      map(user => {
        console.log("aqui"+user.id)
        return !!user && Number(user.id) > 0
      }),
      catchError(err => {
        if (err.status === 404) {
          console.warn('Usuário não encontrado');
        } else {
          console.error('Erro ao verificar usuário:', err);
        }
        return of(false);
      })
    );
  }
  
  login(username: string, password: string): Observable<boolean>{
    const auth = {
      username: username,
      senha: password,
    }

    return this.httpClient.post(this.baseUrl, auth ).pipe(
      map(jwt => {
        return (true)
      }),
      catchError(err => {
        if(err.status === 404){
          console.warn("Usuário não encontrado")
        }
        else{
          console.error("Erro ao verificar login:", err)
        }
        return of(false)
      })
    )
  }
}
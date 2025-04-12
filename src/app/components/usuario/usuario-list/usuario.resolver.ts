import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioResolver implements Resolve<Usuario | null> {
  
  constructor(private usuarioService: UsuarioService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Usuario | null> {
    const id = Number(route.paramMap.get('id'));
    
    if (isNaN(id) || id <= 0) {
      return of(null);
    }
    
    return this.usuarioService.findById(id.toString()).pipe(
      catchError(() => {
        console.error('Erro ao carregar dados do usuário');
        return of(null);
      })
    );
  }
}
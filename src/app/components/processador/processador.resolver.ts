import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcessadorService } from '../../services/processador.service';
import { Processador } from '../../models/processador.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessadorResolver {

  constructor(private processadorService: ProcessadorService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Processador | null> {
    const id = route.paramMap.get('id');
    
    if (!id || id === 'new') {
      return of(null);
    }
    console.log('ProcessadorResolver: ID recebido:', id);
    
    return this.processadorService.findById(+id).pipe(
      catchError(error => {
        console.error('Erro ao carregar processador:', error);
        return of(null);
      })
    );
  }
}
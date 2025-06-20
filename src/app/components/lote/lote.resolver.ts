import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoteService } from '../../services/lote.service';
import { Lote } from '../../models/lote.model';

@Injectable({
  providedIn: 'root'
})
export class LoteResolver {

  constructor(private loteService: LoteService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Lote | null> {
    const id = route.paramMap.get('id');
    console.log('LoteResolver: ID recebido:', id);
    // Se não for uma rota de edição (não tem ID ou é 'new'), retorna null
    if (!id || id === 'new') {
      return of(null);
    }
    
    return this.loteService.findById(+id).pipe(
      catchError(error => {
        console.error('Erro ao carregar lote:', error);
        return of(null);
      })
    );

  }
}
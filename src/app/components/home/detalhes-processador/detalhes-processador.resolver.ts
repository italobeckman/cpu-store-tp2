import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Processador } from '../../../models/processador.model';
import { ProcessadorService } from '../../../services/processador.service';

export const detalhesProcessadorResolver: ResolveFn<Processador> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    console.log('detalhesProcessadorResolver', inject(ProcessadorService).findById(+route.paramMap.get('id')!))
    return inject(ProcessadorService).findById(+route.paramMap.get('id')!);
};

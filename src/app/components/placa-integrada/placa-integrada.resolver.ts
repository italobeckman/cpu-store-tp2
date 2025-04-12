import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PlacaIntegrada } from '../../models/placa-integrada.model';
import { PlacaIntegradaService } from '../../services/placa-integrada.service';

export const placaIntegrada: ResolveFn<PlacaIntegrada> = 
    (route : ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      
      return inject(PlacaIntegradaService).findById(Number(route.paramMap.get('id')));
    
};

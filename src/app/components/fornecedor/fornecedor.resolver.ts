import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Estado } from '../../models/estado.model';
import { inject } from '@angular/core';
import { EstadoService } from '../../services/estado.service';
import { Fornecedor } from '../../models/fornecedor.model';
import { FornecedorService } from '../../services/fornecedor.service';

export const fornecedorResolver: ResolveFn<Fornecedor> = 
    (route : ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(FornecedorService).findById(route.paramMap.get('id')!);
    
};
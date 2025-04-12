import { Injectable } from '@angular/core';
import { Telefone } from '../models/telefone';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {

  constructor() { }

  public static converteStringToTelefone(telefone: string): Telefone {
    let codigoArea = telefone.slice(0, 2)
    let numero = telefone.slice(2)

    return  {
      codigoArea,
      numero
    }
  }

  public static converteTelefoneToString(telefone: Telefone): string {
    if (!telefone?.codigoArea || !telefone?.numero) {
      throw new Error('Objeto Telefone inválido');
    }

    return `${telefone.codigoArea}${telefone.numero}`;
  }
}

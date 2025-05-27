// src/app/models/cartao.model.ts

export enum TipoCartao {
    CREDITO = 'CREDITO',
    DEBITO = 'DEBITO'
}
  
export class Cartao {
  constructor(
    public id: number,
    public nomeTitular: string,
    public numero: string,
    public cpf: string,
    public validade: string, // ou Date, veja observação abaixo
    public tipo: number
  ) {}
}

export class CartaoRetorno {
  constructor(
    public id: number,
    public nomeTitular: string,
    public numero: string,
    public cpf: string,
    public validade: string, // ou Date, veja observação abaixo
    public tipo: TipoRetorno
  ) {}
}
  
export class TipoRetorno {
  constructor(
    public id: number,
    public label: string
  ) {}
}
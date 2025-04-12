import { Cidade } from "./cidade.model";

export class Endereco {
    id!: number;
    logradouro!: string;
    cep!: string;
    bairro!: string;
    complemento!: string;
    numero!: number;
    idCidade!: number;
    cidade!: Cidade; 
}
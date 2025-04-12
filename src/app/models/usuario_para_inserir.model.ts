import { Telefone } from "./telefone";

export class UsuarioParaInserir {
    username!: string;
    email!: string;
    cpf!: string; 
    senha!: string;
    telefone!: Telefone;
    dataNascimento!: Date;
}
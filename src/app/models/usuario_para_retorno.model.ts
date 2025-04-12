import { Telefone } from "./telefone";

export class UsuarioParaRetorno {
    id!: string;
    username!: string;
    email!: string;
    cpf!: string; 
    senha!: string;
    telefone!: Telefone;
    dataNascimento!: Date;
}
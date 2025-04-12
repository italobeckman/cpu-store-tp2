import { Funcionario } from "./Funcionario.model";

export class Usuario {
    id!: number;
    username!: string;
    email!: string;
    cpf!: string; 
    senha!: string;
    telefone!: string;
    categoria!: string;
    dataNascimento!: Date;
    cargo!: string;
    salario!: number;
    isFuncionario!: boolean;
    funcionario!: Funcionario;
}
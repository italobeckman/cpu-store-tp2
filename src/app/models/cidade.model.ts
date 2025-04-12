export class Cidade {
    id!: number;
    nome!: string;
    estado?: { id: number; nome?: string } | number; 
    nomeEstado!: string; 
}
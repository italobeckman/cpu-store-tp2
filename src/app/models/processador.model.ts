import { Fabricante } from "./fabricante.model";
import { PlacaIntegrada } from "./placa-integrada.model";

export class Processador {
    id!: number;
    nome!: string;
    socket!: string;
    threads!: number;
    nucleos!: number;
    desbloqueado!: boolean;
    preco!: number;
    fabricante!: Fabricante;
    placaIntegrada!: PlacaIntegrada;
    memoriaCache!: MemoriaCache;
    frequencia!: Frequencia;
    consumoEnergetico!: ConsumoEnergetico;
    conectividade!: Conectividade;
    imagens!: string[];
  }
  
  // Interfaces auxiliares (você pode ajustar conforme a estrutura real dessas classes em Java)
  
  export class MemoriaCache {
    l1?: number;
    l2?: number;
    l3?: number;
  }
  
  export class Frequencia {
    base!: number;
    turbo?: number;
  }
  
  export class ConsumoEnergetico {
    tdp!: number;
    tecnologia!: string;
  }
  
  export class Conectividade {
    pciExpress!: string;
    wireless?: boolean;
    bluetooth?: boolean;
  }
  
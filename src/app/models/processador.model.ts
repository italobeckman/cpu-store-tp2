import { Fabricante } from './fabricante.model';
import { PlacaIntegrada } from './placa-integrada.model';

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
  desconto!: number;
  emEstoque?: boolean;
}

export class MemoriaCache {
  cacheL2!: number;
  cacheL3!: number;
}

export class Frequencia {
  clockBasico!: number;
  clockBoost!: number;
}

export class ConsumoEnergetico {
  energiaBasica?: number;
  energiaMaxima!: number;
}

export class Conectividade {
  pci!: number;
  tipoMemoria!: string;
  canaisMemoria!: number;
}

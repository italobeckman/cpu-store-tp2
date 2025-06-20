import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  Conectividade,
  type Processador,
} from '../../../models/processador.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fabricante } from '../../../models/fabricante.model';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ProcessadorService } from '../../../services/processador.service';
import { ListaDesejoService } from '../../../services/lista-desejo.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoteService } from '../../../services/lote.service';

interface ProcessadorCard {
  id: number;
  nome: string;
  preco: number;
  fabricante: Fabricante;
  imagensUrl: string[];
  primaryImageUrl: string;
  safeImageUrl?: SafeResourceUrl;
  socket: string;
  frequencia: any;
  nucleos: number;
  threads: number;
  emEstoque?: boolean;
}

interface ProcessadorDetalhes {
  id: number;
  nome: string;
  imagens: string[];
  socket: string;
  threads: number;
  nucleos: number;
  desbloqueado: boolean;
  preco: number;
  placaIntegrada: any;
  memoriaCache: {
    cacheL2: number;
    cacheL3: number;
  };
  frequencia: {
    clockBasico: number;
    clockBoost: number;
  };
  consumoEnergetico: {
    energiaBasica: number;
    energiaMaxima: number;
  };
  conectividade: {
    pci: number;
    tipoMemoria: string;
    canaisMemoria: number;
  };
  fabricante: {
    id: number;
    nome: string;
    email: string;
    telefone: {
      id: number;
      codigoArea: string;
      numero: string;
    };
  };
  desconto: number | null;
}
@Component({
  selector: 'app-detalhes-processador',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './detalhes-processador.component.html',
  styleUrls: ['./detalhes-processador.component.css'],
})
export class DetalhesProcessadorComponent implements OnInit {
  formGroup!: FormGroup;
  processador!: Processador;
  primaryImgUrl: string | undefined;
  imagens: string[] = [];
  imagemSelecionada: string | undefined;
  abaAtiva: string = 'especificacoes';
  erro?: string;
  adicionadoListaDesejos = false;
  listaDesejos: Processador[] = [];

  constructor(
    private fabricanteService: FabricanteService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private carrinhoService: CarrinhoService,
    public processadorService: ProcessadorService,
    private listaDesejoService: ListaDesejoService,
    private loteService: LoteService
  ) {
    this.processador = this.activatedRoute.snapshot.data['processador'];

    this.formGroup = this.formBuilder.group({
      id: [this.processador?.id || null],
      nome: [this.processador?.nome || ''],
      preco: [this.processador?.preco || 0],
      fabricante: [this.processador?.fabricante || ''],
      socket: [this.processador?.socket || ''],
      threads: [this.processador?.threads || 0],
      nucleos: [this.processador?.nucleos || 0],
      desbloqueado: [this.processador?.desbloqueado || false],
      placaIntegrada: [this.processador?.placaIntegrada || null],
      memoriaCacheL2: [this.processador?.memoriaCache.cacheL2 || null],
      memoriaCacheL3: [this.processador?.memoriaCache.cacheL3 || null],

      frequencia: this.formBuilder.group({
        clockBasico: [this.processador?.frequencia.clockBasico || null],
        clockBoost: [this.processador?.frequencia.clockBoost || null],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [
          this.processador?.consumoEnergetico.energiaBasica || null,
        ],
        energiaMaxima: [
          this.processador?.consumoEnergetico.energiaMaxima || null,
        ],
      }),

      conectividadePci: [this.processador?.conectividade.pci || null],
      conectividadeTipoMemoria: [
        this.processador?.conectividade.tipoMemoria || null,
      ],
      conectividadeCanaisMemoria: [
        this.processador?.conectividade.canaisMemoria || null,
      ],

      imagens: [this.processador?.imagens || []],
      desconto: [this.processador?.desconto || 0],
      emEstoque: false,
    });

    this.loteService
      .findEstoqueById(this.formGroup.get('id')?.value)
      .subscribe((estoque: number) => {
        this.formGroup.patchValue({ emEstoque: estoque > 0 });
      });
  }

  ngOnInit(): void {
    console.log('Processador Detalhes:', this.processador);
    this.imagens = this.processador.imagens || [];
    this.imagemSelecionada =
      this.imagens.length > 0
        ? this.processadorService.getImageUrl(this.imagens[0])
        : undefined;
    this.carregarListaDesejos();
  }

  carregarListaDesejos(): void {
    this.listaDesejoService.getListaDeDesejos().subscribe({
      next: (dados) => {
        this.listaDesejos = dados;
      },
      error: () => {
      },
    });
  }

  selecionarImagem(imagem: string) {
    this.imagemSelecionada = this.processadorService.getImageUrl(imagem);
  }

  comprar(processador: Processador): void {
    console.log(`Comprando processador: ${processador.nome}`);

    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
      desconto: processador.desconto,
    });

    window.location.href = '/carrinho';
  }

  voltar(): void {
    window.location.href = '/home';
  }

  estaNaListaDeDesejos(processadorId: number): boolean {
    return this.listaDesejos.some((p) => p.id === processadorId);
  }

  adicionarAListaDesejos(processadorId: number): void {
    this.listaDesejoService.addToListaDeDesejos(processadorId).subscribe({
      next: () => {
        this.carregarListaDesejos(); // Atualiza a lista após adicionar
      },
      error: () => {
        this.erro = 'Erro ao adicionar item à lista de desejos';
      },
    });
  }

  removerDaListaDesejos(processadorId: number): void {
    this.listaDesejoService.removeFromListaDeDesejos(processadorId).subscribe({
      next: () => {
        this.carregarListaDesejos(); // Atualiza a lista após remover
      },
      error: () => {
        this.erro = 'Erro ao remover item da lista de desejos';
      },
    });
  }
}

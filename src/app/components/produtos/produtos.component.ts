import { booleanAttribute, Component, OnInit } from '@angular/core';
import { Fabricante } from '../../models/fabricante.model';
import {
  SafeResourceUrl,
  DomSanitizer,
  BrowserModule,
} from '@angular/platform-browser';
import { Processador } from '../../models/processador.model';
import { ProcessadorService } from '../../services/processador.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { FormsModule } from '@angular/forms';
import { ListaDesejoService } from '../../services/lista-desejo.service';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { LoteService } from '../../services/lote.service';

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
  desbloqueado?: boolean;
  placaIntegrada?: any;
  memoriaCache?: any;
  consumoEnergetico?: any;
  conectividade?: any;
  desconto: number;
  emEstoque?: boolean;
}

@Component({
  selector: 'app-produtos',
  imports: [CommonModule, RouterModule, FormsModule, MatTooltip],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  processadores: Processador[] = [];
  cards: ProcessadorCard[] = [];

  isLoading = true;
  errorMessage: string = '';
  filtro: {
    nome: string;
    fabricante: any[];
    frequenciaMin: null | number;
    frequenciaMax: null | number;
    precoMin: null | number;
    precoMax: null | number;
    socket: any[];
    nucleos: any[];
    [key: string]: string | any[] | null | number;
  } = {
    nome: '',
    fabricante: [],
    frequenciaMin: 0,
    frequenciaMax: null,
    precoMin: null,
    precoMax: null,
    socket: [],
    nucleos: [],
  };

  sortOption: string = 'newest';
  listaDesejos: number[] = [];

  constructor(
    private processadorService: ProcessadorService,
    private carrinhoService: CarrinhoService,
    private searchService: SearchService,
    public sanitizer: DomSanitizer,
    private produtoService: ProdutoService,
    public authService: AuthService,
    private loteService: LoteService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['nome']) {
        this.filtro.nome = params['nome'];
        this.buscarProdutos();
      } else {
        this.loadProcessadores();
      }
    });
  }

  loadProcessadores(): void {
    this.isLoading = true;
    this.processadorService.findAll().subscribe({
      next: async (data) => {
        // Busca o estoque de todos os processadores em paralelo
        const processadoresComEstoque = await Promise.all(
          data.map(async (proc) => {
            const estoque = await this.loteService.findEstoqueById(proc.id).toPromise();
            return { ...proc, estoque: estoque ?? 0 };
          })
        );
        processadoresComEstoque.sort((a, b) => b.estoque - a.estoque);
        this.processadores = processadoresComEstoque;
        this.carregarCardsProcessadores();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar processadores.';
        this.isLoading = false;
      }
    });
  }

  private carregarCardsProcessadores(): void {
    this.cards = this.processadores.map((processador) => {
      const primaryImageUrl =
        processador.imagens && processador.imagens.length > 0
          ? this.processadorService.getImageUrl(processador.imagens[0])
          : 'img/processor-placeholder.png';

      const card: ProcessadorCard = {
        id: processador.id,
        nome: processador.nome,
        preco: processador.preco,
        fabricante: processador.fabricante,
        imagensUrl: this.getUrlsImagens(processador.imagens || []),
        socket: processador.socket,
        frequencia: processador.frequencia?.clockBoost,
        nucleos: processador.nucleos,
        threads: processador.threads,
        desbloqueado: processador.desbloqueado,
        placaIntegrada: processador.placaIntegrada,
        memoriaCache: processador.memoriaCache,
        consumoEnergetico: processador.consumoEnergetico,
        conectividade: processador.conectividade,
        primaryImageUrl,
        safeImageUrl:
          this.sanitizer.bypassSecurityTrustResourceUrl(primaryImageUrl),
        desconto: processador.desconto,
        emEstoque: false,
      };

      this.loteService
        .findEstoqueById(processador.id)
        .subscribe((estoque: number) => {
          card.emEstoque = estoque > 0;
        });
      console.log('ProcessadorCard:', card);
      return card;
    });
  }

  private getUrlsImagens(imagens: string[]): string[] {
    return imagens.map((imagem) => this.processadorService.getImageUrl(imagem));
  }

  buscarProdutos() {
    this.isLoading = true;
    this.produtoService
      .buscarPorFiltro(this.filtro)
      .subscribe((res: Object) => {
        this.cards = (res as Processador[]).map((processador: Processador) => {
          const primaryImageUrl =
            processador.imagens && processador.imagens.length > 0
              ? this.processadorService.getImageUrl(processador.imagens[0])
              : 'img/processor-placeholder.png';

          const card: ProcessadorCard = {
            id: processador.id,
            nome: processador.nome,
            preco: processador.preco,
            fabricante: processador.fabricante,
            imagensUrl: this.getUrlsImagens(processador.imagens || []),
            socket: processador.socket,
            frequencia: processador.frequencia?.clockBoost,
            nucleos: processador.nucleos,
            threads: processador.threads,
            desbloqueado: processador.desbloqueado,
            placaIntegrada: processador.placaIntegrada,
            memoriaCache: processador.memoriaCache,
            consumoEnergetico: processador.consumoEnergetico,
            conectividade: processador.conectividade,
            primaryImageUrl,
            safeImageUrl:
              this.sanitizer.bypassSecurityTrustResourceUrl(primaryImageUrl),
            desconto: processador.desconto,
            emEstoque: false,
          };

          this.loteService
            .findEstoqueById(processador.id)
            .subscribe((estoque: number) => {
              card.emEstoque = estoque > 0;
            });

          return card;
        });
        this.isLoading = false;
      });
  }

  limparFiltros() {
    this.filtro = {
      nome: '',
      fabricante: [],
      frequenciaMin: null,
      frequenciaMax: null,
      precoMin: null,
      precoMax: null,
      socket: [],
      nucleos: [],
    };
    this.loadProcessadores(); 
  }

  adicionarAoCarrinho(processador: any, event: MouseEvent) {
    event.stopPropagation();
    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
      desconto: processador.desconto,
    });
  }
  onCheckboxChange(event: any, filterType: string): void {
    const value = event.target.value;
    const checked = event.target.checked;
    if (!this.filtro[filterType]) {
      this.filtro[filterType] = [];
    }
    if (checked) {
      if (
        Array.isArray(this.filtro[filterType]) &&
        !this.filtro[filterType].includes(value)
      ) {
        this.filtro[filterType].push(value);
      }
    } else {
      if (Array.isArray(this.filtro[filterType])) {
        this.filtro[filterType] = this.filtro[filterType].filter(
          (v: any) => v !== value
        );
      }
    }
    this.buscarProdutos();
  }

  ordenarProdutos() {
    switch (this.sortOption) {
      case 'price-asc':
        this.cards.sort((a, b) => a.preco - b.preco);
        break;
      case 'price-desc':
        this.cards.sort((a, b) => b.preco - a.preco);
        break;
      case 'name-asc':
        this.cards.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'name-desc':
        this.cards.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'newest':
      default:
        this.cards.sort((a, b) => b.id - a.id);
        break;
    }
  }

  comprar(card: ProcessadorCard, event: MouseEvent) {
    if (!card.emEstoque) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.carrinhoService.adicionarProduto({
      id: card.id,
      nome: card.nome,
      preco: card.preco,
      quantidade: 1,
      desconto: card.desconto,
    });
  }
}

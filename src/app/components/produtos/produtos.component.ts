import { Component, OnInit } from '@angular/core';
import { Fabricante } from '../../models/fabricante.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Processador } from '../../models/processador.model';
import { ProcessadorService } from '../../services/processador.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';

interface ProcessadorCard {
  id: number;
  nome: string;
  preco: number;
  fabricante: Fabricante;
  imagensUrl: string[];
  primaryImageUrl: string;
  safeImageUrl?: SafeResourceUrl;
  socket: string;
  frequencia: any; // Pode ser ajustado para o tipo correto
  nucleos: number;
  threads: number;
  desbloqueado?: boolean;
  placaIntegrada?: any; // Ajuste para o tipo correto se necessário
  memoriaCache?: any;   // Ajuste para o tipo correto se necessário
  consumoEnergetico?: any;
  conectividade?: any;
  desconto: number;
}

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css',
})
export class ProdutosComponent implements OnInit {
  processadores: Processador[] = [];
  cards: ProcessadorCard[] = [];

  isLoading = true;
  errorMessage: string = '';
  constructor(
    private processadorService: ProcessadorService,
    private carrinhoService: CarrinhoService,
    private searchService: SearchService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProcessadores();
  }

  loadProcessadores(): void {
    this.isLoading = true;
    this.processadorService.findAll().subscribe({
      next: (data) => {
        this.processadores = data;
        this.processadores = this.processadores.reverse();
        this.carregarCardsProcessadores();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar processadores:', err);
        this.errorMessage =
          'Não foi possível carregar os processadores. Tente novamente mais tarde.';
        this.isLoading = false;
      },
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
        safeImageUrl: this.sanitizer.bypassSecurityTrustResourceUrl(primaryImageUrl),
        desconto: processador.desconto,
      };
      return card;
    });
  }

  private getUrlsImagens(imagens: string[]): string[] {
    return imagens.map((imagem) => this.processadorService.getImageUrl(imagem));
  }
}

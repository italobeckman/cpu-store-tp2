import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import type { Processador } from '../../models/processador.model';
import type { Fabricante } from '../../models/fabricante.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProcessadorService } from '../../services/processador.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { SearchService } from '../../services/search.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import SwiperCore from 'swiper';

interface ProcessadorCard {
  id: number;
  nome: string;
  preco: number;
  fabricante: Fabricante;
  imagensUrl: string[];
  primaryImageUrl: string;
  safeImageUrl?: SafeResourceUrl;
  socket: string;
  frequencia: any; // Ajuste para o tipo correto se necessário
  nucleos: number;
  threads: number;
  desbloqueado?: boolean;
  placaIntegrada?: any;
  memoriaCache?: any;
  consumoEnergetico?: any;
  conectividade?: any;
  desconto: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  processadores: Processador[] = [];
  cards: ProcessadorCard[] = [];
  cardsAMD: ProcessadorCard[] = [];
  cardsIntel: ProcessadorCard[] = [];
  isLoading = true;
  errorMessage = '';
  query: string = '';
  private countdownSub?: Subscription;
  private _countdown = new BehaviorSubject<string>('00D 00:00:00');
  countdown$ = this._countdown.asObservable();
  countdown = '';
  currentIndex = 0;
  autoSlideInterval: any;

  images = [
    '/img/banner/banner3.png',
    // '/img/banner/banner2.png',
    // '/img/banner/banner1.png',
    '/img/promocao.jpeg',
    
  ];

  constructor(
    private processadorService: ProcessadorService,
    private sanitizer: DomSanitizer,
    private carrinhoService: CarrinhoService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.query$.subscribe((value) => {
      this.query = value;
      console.log('Recebido no outro componente:', value);
      this.loadProcessadores();
    });

    const endDate = new Date('2025-07-01T23:59:59');
    this.startCountdown(endDate);

    this.countdown$.subscribe((countdown) => {
      this.countdown = countdown;
    });

    this.startAutoSlide();
  }

  loadProcessadores(): void {
    this.isLoading = true;
    this.processadorService.findAll().subscribe({
      next: (data) => {
        this.processadores = data;
        this.processadores = this.processadores.reverse();
        this.carregarCardsProcessadores();
        this.isLoading = false;

        console.log(this.query.length);
        if (this.query.length > 0) {
          this.filterCardsByQuery();
        }

        this.loadProcessadoresIbm();
        this.loadProcessadoresIntel();
      },
      error: (err) => {
        console.error('Erro ao carregar processadores:', err);
        this.errorMessage =
          'Não foi possível carregar os processadores. Tente novamente mais tarde.';
        this.isLoading = false;
      },
    });
  }

  filterCardsByQuery(): void {
    console.log('Filtrando cards com a query:', this.query);
    this.cards = this.cards.filter((card) => {
      const srcProcessador =
        card.nome.toLowerCase() +
        card.fabricante?.nome.toLowerCase() +
        card.nucleos +
        card.threads +
        card.frequencia +
        card.socket +
        card.preco;

      const queryLower = this.query.toLowerCase();
      return srcProcessador.includes(queryLower);
    });
  }

  loadProcessadoresIbm(): void {
    console.log(this.cards[0].fabricante?.nome);
    this.cardsAMD = this.cards.filter(
      (card) => card.fabricante?.nome === 'AMD'
    );
  }

  loadProcessadoresIntel(): void {
    this.cardsIntel = this.cards.filter(
      (card) => card.fabricante?.nome === 'Intel'
    );
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
        frequencia: processador.frequencia?.clockBoost, // Ajustado conforme solicitado
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

  comprar(processador: ProcessadorCard): void {
    console.log(`Comprando processador: ${processador.nome}`);

    // Redirecionar para a página do carrinho
    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
      desconto: processador.desconto,
    });

    window.location.href = '/carrinho';
  }

  // Método para lidar com erros de carregamento de imagem
  handleImageError(card: ProcessadorCard): void {
    card.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'assets/images/processor-placeholder.png'
    );
  }

  onImageError(event: any): void {
    event.target.src = '/img/processor-placeholder.png';
  }

  startCountdown(targetDate: Date): void {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }

    this.countdownSub = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        this._countdown.next('00D 00:00:00');
        this.countdownSub?.unsubscribe();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const formatted = `${this.pad(days)}D ${this.pad(hours)}:${this.pad(
        minutes
      )}:${this.pad(seconds)}`;
      this._countdown.next(formatted);
    });
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Troca de slide a cada 5 segundos
  }
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}

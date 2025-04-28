import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { RouterLink } from "@angular/router"
import type { Processador } from "../../models/processador.model"
import type { Fabricante } from "../../models/fabricante.model"
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"
import { ProcessadorService } from "../../services/processador.service"
import { CarrinhoService } from "../../services/carrinho.service"

interface ProcessadorCard {
  id: number
  nome: string
  preco: number
  fabricante: Fabricante
  imagensUrl: string[]
  primaryImageUrl: string
  safeImageUrl?: SafeResourceUrl
  socket: string
  frequencia: number
  nucleos: number
  threads: number
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  processadores: Processador[] = []
  cards: ProcessadorCard[] = []
  isLoading = true
  errorMessage = ""

  constructor(
    private processadorService: ProcessadorService,
    private sanitizer: DomSanitizer,
    private carrinhoService: CarrinhoService,
  ) {}

  ngOnInit(): void {
    this.loadProcessadores()
  }

  loadProcessadores(): void {
    this.isLoading = true
    this.processadorService.findAll().subscribe({
      next: (data) => {
        this.processadores = data
        this.carregarCardsProcessadores()
        this.isLoading = false
      },
      error: (err) => {
        console.error("Erro ao carregar processadores:", err)
        this.errorMessage = "Não foi possível carregar os processadores. Tente novamente mais tarde."
        this.isLoading = false
      },
    })
  }

  private carregarCardsProcessadores(): void {
    this.cards = this.processadores.map((processador) => {
      // Verificar se o processador tem imagens antes de acessar o índice 0
      const primaryImageUrl =
        processador.imagens && processador.imagens.length > 0
          ? this.processadorService.getImageUrl(processador.imagens[0])
          : "assets/images/processor-placeholder.png"

      const card: ProcessadorCard = {
        id: processador.id,
        nome: processador.nome,
        preco: processador.preco,
        fabricante: processador.fabricante,
        imagensUrl: this.getUrlsImagens(processador.imagens || []),
        socket: processador.socket,
        frequencia: Number(processador.frequencia),
        nucleos: processador.nucleos,
        threads: processador.threads,
        primaryImageUrl,
        safeImageUrl: this.sanitizer.bypassSecurityTrustResourceUrl(primaryImageUrl),
      }
      return card
    })
  }

  private getUrlsImagens(imagens: string[]): string[] {
    return imagens.map((imagem) => this.processadorService.getImageUrl(imagem))
  }

  comprar(processador: ProcessadorCard): void {
    console.log(`Comprando processador: ${processador.nome}`)
    
    // Redirecionar para a página do carrinho
    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
    })
    
    window.location.href = "/carrinho";
  }

  // Método para lidar com erros de carregamento de imagem
  handleImageError(card: ProcessadorCard): void {
    card.safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl("assets/images/processor-placeholder.png")
  }
}

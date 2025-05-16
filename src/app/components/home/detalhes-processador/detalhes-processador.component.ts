import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import type { Processador } from "../../../models/processador.model"
import { FabricanteService } from "../../../services/fabricante.service"
import { ActivatedRoute } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Fabricante } from "../../../models/fabricante.model"
import { SafeResourceUrl } from "@angular/platform-browser"
import { CarrinhoService } from "../../../services/carrinho.service"
import { ProcessadorService } from "../../../services/processador.service"

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
  selector: "app-detalhes-processador",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: "./detalhes-processador.component.html",
  styleUrls: ["./detalhes-processador.component.css"],
})
export class DetalhesProcessadorComponent implements OnInit {
  formGroup!: FormGroup
  processador!: Processador
  primaryImgUrl: string | undefined

  constructor(
    private fabricanteService: FabricanteService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private carrinhoService: CarrinhoService,
    private procesadorServicethis: ProcessadorService,
  ) {
    this.processador = this.activatedRoute.snapshot.data["processador"]

    this.formGroup = this.formBuilder.group({
      id: [this.processador?.id || null],
      nome: [this.processador?.nome || ""],
      preco: [this.processador?.preco || 0],
      fabricante: [this.processador?.fabricante || ""],
      socket: [this.processador?.socket || ""],
      frequencia: [this.processador?.frequencia || 0],
      nucleos: [this.processador?.nucleos || 0],
      threads: [this.processador?.threads || 0],
    })
  }

  ngOnInit(): void {
    this.primaryImgUrl = this.procesadorServicethis.getImageUrl(this.processador.imagens[0]);
  }

  comprar(processador: Processador): void {
    console.log(`Comprando processador: ${processador.nome}`)
    
    // Redirecionar para a página do carrinho
    this.carrinhoService.adicionarProduto({
      id: processador.id,
      nome: processador.nome,
      preco: processador.preco,
      quantidade: 1,
      desconto: processador.desconto,
    })
    
    window.location.href = "/carrinho";
  }

  voltar(): void {
    window.location.href = "/home";
  }
}

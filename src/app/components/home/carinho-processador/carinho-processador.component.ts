import { Component, type OnInit } from "@angular/core"
import { CommonModule, CurrencyPipe } from "@angular/common"
import { FormsModule, ReactiveFormsModule, type FormGroup, Validators, FormBuilder } from "@angular/forms"

// Angular Material Imports
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"

import type { Produto } from "../../../models/Produto.model"
import type { Observable } from "rxjs"

import { CarrinhoService } from "../../../services/carrinho.service"
import { ProcessadorService } from "../../../services/processador.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-carinho-processador",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: "./carinho-processador.component.html",
  styleUrl: "./carinho-processador.component.css",
})
export class CarinhoProcessadorComponent implements OnInit {
  produtosNoCarrinho: Produto[] = []
  total = 0
  frete = 0
  descontoAplicado = false
  codigoPromocional = ""

  // Formulários
  enderecoForm!: FormGroup
  pagamentoForm!: FormGroup
  revisaoForm!: FormGroup

  // Estado do processamento
  isProcessando = false
  formError = false

  // Valores para cálculos
  subtotal = 0
  desconto = 0
  totalFinal = 0
  ids: number[] = []
  imgUrls = new Map<number, string>()

  produtos!: Observable<Produto[]>

  constructor(
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
    private processadorService: ProcessadorService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    // Inicialização dos formulários
    this.enderecoForm = this.fb.group({
      nomeCompleto: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      telefone: ["", [Validators.required]],
      cep: ["", [Validators.required]],
      endereco: ["", [Validators.required]],
      numero: ["", [Validators.required]],
      complemento: [""],
      bairro: ["", [Validators.required]],
      cidade: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    })

    this.pagamentoForm = this.fb.group({
      metodoPagamento: ["cartao", [Validators.required]],
      numeroCartao: ["", []],
      nomeCartao: ["", []],
      validadeCartao: ["", []],
      cvvCartao: ["", []],
      parcelamento: ["1"],
      chavePix: ["cpf"],
      cpfBoleto: ["", []],
    })

    this.revisaoForm = this.fb.group({
      aceitarTermos: [false, [Validators.requiredTrue]],
    })
  }

  aumentar(produtoId: number) {
    this.carrinhoService.aumentarQuantidade(produtoId)
  }

  diminuir(produtoId: number) {
    this.carrinhoService.diminuirQuantidade(produtoId)
  }

  ngOnInit(): void {
    this.produtos = this.carrinhoService.obterProdutos()
    this.carregarProdutos()
  }

  carregarProdutos(): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      this.produtosNoCarrinho = produtos
      this.calcularTotais()
    })
  }

  calcularTotais(): void {
    this.subtotal = this.produtosNoCarrinho.reduce((soma, p) => soma + p.preco * p.quantidade, 0)

    // Cálculo do frete (exemplo: frete grátis acima de R$ 300)
    this.frete = this.subtotal > 300 ? 0 : 30

    // Cálculo do desconto (se aplicado)
    this.desconto = this.descontoAplicado ? this.subtotal * 0.1 : 0

    // Total final
    this.totalFinal = this.subtotal + this.frete - this.desconto
  }

  removerProduto(produtoId: number): void {
    this.carrinhoService.removerProduto(produtoId)
    this.snackBar.open("Produto removido do carrinho", "Fechar", {
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    })
  }

  aplicarCupom(): void {
    if (this.codigoPromocional.trim().toLowerCase() === "cpu10") {
      this.descontoAplicado = true
      this.calcularTotais()
      this.snackBar.open("Cupom aplicado com sucesso! 10% de desconto.", "Fechar", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
      })
    } else {
      this.snackBar.open("Cupom inválido", "Fechar", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
      })
    }
  }

  // Finalização da compra
  finalizarCompra(): void {
    this.router.navigate(["/pagamento"])
  }

  continuarComprando(): void {
    // Navega de volta para a página inicial
    window.location.href = "/home"
  }

  getUrlImgProduto(id: number): void {
    if (!this.imgUrls.has(id)) {
      this.processadorService.findById(id).subscribe((processador) => {
        const url = this.processadorService.getImageUrl(processador.imagens[0])
        this.imgUrls.set(id, url)
      })
    }
  }
}

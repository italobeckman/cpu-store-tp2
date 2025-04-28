import { Component, type OnInit } from "@angular/core"
import { CommonModule, CurrencyPipe } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"

// Angular Material Imports
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTooltipModule } from "@angular/material/tooltip"

import type { Produto } from "../../../models/Produto.model"
import { CarrinhoService } from "../../../services/carrinho.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Observable } from "rxjs"

@Component({
  selector: "app-carinho-processador",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    // MatSnackBar removed from imports as it is not a standalone component
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

  // Valores para cálculos
  subtotal = 0
  desconto = 0
  totalFinal = 0

  produtos!: Observable<Produto[]>;

  constructor(
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
  ) {}

  aumentar(produtoId: number) {
    this.carrinhoService.aumentarQuantidade(produtoId);
  }

  diminuir(produtoId: number) {
    this.carrinhoService.diminuirQuantidade(produtoId);
  }


  ngOnInit(): void {
    this.produtos = this.carrinhoService.obterProdutos();
    this.carregarProdutos();
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

  finalizarCompra(): void {
    this.snackBar.open("Pedido finalizado com sucesso!", "Fechar", {
      duration: 3000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    })
    // Aqui você implementaria a navegação para a página de checkout
    // this.router.navigate(['/checkout']);
  }

  continuarComprando(): void {
    // Navega de volta para a página inicial
    window.location.href = "/home";
  }

  
}

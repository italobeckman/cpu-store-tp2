import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule, MatIcon } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { FormBuilder, FormGroup, FormsModule } from "@angular/forms"
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card"
import { MatDivider, MatList, MatListItem } from "@angular/material/list"
import { NgFor } from "@angular/common"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { CarrinhoService } from "../../services/carrinho.service"
import { MatFormField, MatLabel, MatOption } from "@angular/material/select"

import { ReactiveFormsModule } from '@angular/forms';

interface Cartao {
  apelido: string
  ultimoDigito: string
}

@Component({
  selector: "app-pagamento",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Adicione isso aqui
    MatCardContent,
    MatCardHeader,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatListItem,
    MatList,
    MatCardActions,
    MatIcon,
    NgFor,
    MatDivider,
    MatFormField,
    MatLabel,
    MatOption,
  ],
  templateUrl: "./pagamento.component.html",
  styleUrls: ["./pagamento.component.css"],
})
export class ResumoPagamentoComponent implements OnInit {

  valorParaPagar = 0
  produtosNome: string[] = []
  desconto = 0
  showInstallments = false
  cupomAplicado = false
  codigoPromocional = ""
  formPagamento!: FormGroup; 

  installmentOptions: { text: string; value: string }[] = []
  parcelaSelecionada: { text: string; value: string } | null = null;

  get formaPagamentoSelecionada(): string {
    return this.formPagamento.get('formaPagamento')?.value;
  }

  selecionarParcela(option: { text: string; value: string }) {
    this.parcelaSelecionada = option;
  }  

  cartoes: Cartao[] = [
    { apelido: 'Visa Pessoal', ultimoDigito: '1234' },
    { apelido: 'Master Empresarial', ultimoDigito: '5678' }
  ]
  
  cartaoSelecionado: any = null;
  
  selecionarCartao(cartao: Cartao) {
    this.cartaoSelecionado = cartao
  }
  
  adicionarCartao() {
    // Aqui você abre um diálogo ou formulário
    this.router.navigate(['pagamento/adicionar_cartao']);
  }
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicialização do componente
    this.calcularValorAPagar()
    this.checkScreenSize()
    window.addEventListener("resize", this.checkScreenSize.bind(this))
    
    this.formPagamento = this.fb.group({
      formaPagamento: ['pix'],
      parcelaSelecionada: ['']
    });
  }

  
  ngOnDestroy(): void {
    window.removeEventListener("resize", this.checkScreenSize.bind(this))
  }

  checkScreenSize(): void {
    // Ajusta o layout com base no tamanho da tela
    const isMobile = window.innerWidth < 768
    const container = document.querySelector(".pagamento-container")
    if (container) {
      if (isMobile) {
        container.classList.add("mobile-view")
      } else {
        container.classList.remove("mobile-view")
      }
    }
  }

  calcularValorAPagar(): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      let total = 0
      const nomes: string[] = []
      let desconto = 0

      produtos.forEach((prod) => {
        if (prod.quantidade > 0) {
          // <- condição que você quiser
          console.log(prod.desconto)
          if (prod.desconto != undefined) {
            total += prod.preco * prod.quantidade - prod.desconto * prod.quantidade
            desconto += prod.desconto * prod.quantidade
          } else {
            total += prod.preco * prod.quantidade
          }
          nomes.push(prod.nome)
        }
      })

      this.valorParaPagar = total
      this.produtosNome = nomes
      this.desconto = desconto

      // Gerar opções de parcelamento baseadas no valor total
      this.gerarOpcoesParcelamento(total)
    })
  }

  gerarOpcoesParcelamento(total: number): void {
    this.installmentOptions = []
    const maxParcelas = total >= 1000 ? 12 : total >= 500 ? 6 : 3

    for (let i = 1; i <= maxParcelas; i++) {
      const valorParcela = total / i
      this.installmentOptions.push({
        text: `${i}x de R$ ${valorParcela.toFixed(2)}`,
        value: i === 1 ? "à vista" : "sem juros",
      })
    }
  }

  toggleInstallments(): void {
    this.showInstallments = !this.showInstallments
  }

  aplicarCupom(): void {
    if (this.codigoPromocional.trim().toLowerCase() === "cpu10") {
      if (!this.cupomAplicado) {
        const descontoAdicional = this.valorParaPagar * 0.1
        this.desconto += descontoAdicional
        this.valorParaPagar -= descontoAdicional
        this.cupomAplicado = true
        this.snackBar.open("Cupom aplicado com sucesso! 10% de desconto.", "Fechar", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
          panelClass: ["success-snackbar"],
        })
      } else {
        this.snackBar.open("Este cupom já foi aplicado.", "Fechar", {
          duration: 3000,
        })
      }
    } else {
      this.snackBar.open("Cupom inválido", "Fechar", {
        duration: 3000,
        panelClass: ["error-snackbar"],
      })
    }
  }

  aumentarQuantidade(produtoNome: string): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      const produto = produtos.find((p) => p.nome === produtoNome)
      if (produto) {
        this.carrinhoService.aumentarQuantidade(produto.id)
        this.calcularValorAPagar()
      }
    })
  }

  diminuirQuantidade(produtoNome: string): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      const produto = produtos.find((p) => p.nome === produtoNome)
      if (produto && produto.quantidade > 1) {
        this.carrinhoService.diminuirQuantidade(produto.id)
        this.calcularValorAPagar()
      }
    })
  }

  removerItem(produtoNome: string): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      const produto = produtos.find((p) => p.nome === produtoNome)
      if (produto) {
        this.carrinhoService.removerProduto(produto.id)
        this.calcularValorAPagar()

        this.snackBar.open("Item removido do carrinho", "Fechar", {
          duration: 3000,
        })
      }
    })
  }

  continuarComprando(): void {
    // Navegar para a página de produtos
    this.router.navigate(["/produtos"])
  }

  finalizarCompra(): void {
    if (this.formaPagamentoSelecionada === 'cartao' && !this.cartaoSelecionado) {
      this.snackBar.open("Selecione um cartão para pagamento", "Fechar", { duration: 3000 });
      return;
    }
  
    if (this.formaPagamentoSelecionada === 'cartao' && !this.parcelaSelecionada) {
      this.snackBar.open("Selecione uma opção de parcelamento", "Fechar", { duration: 3000 });
      return;
    }
    
    if (this.produtosNome.length === 0) {
      this.snackBar.open("Seu carrinho está vazio", "Fechar", {
        duration: 3000,
      });
      return;
    }
  
    if (this.formaPagamentoSelecionada === 'cartao') {
      
      return;
    }
  
    this.snackBar.open("Processando pagamento...", "", {
      duration: 2000,
    });
  
    setTimeout(() => {
      this.snackBar.open("Compra finalizada com sucesso!", "Fechar", {
        duration: 5000,
        panelClass: ["success-snackbar"],
      });
  
      this.produtosNome = [];
      this.router.navigate(["/confirmacao-pedido"]);
    }, 2000);
  }  
}

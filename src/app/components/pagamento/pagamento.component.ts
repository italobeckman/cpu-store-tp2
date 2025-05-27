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
import { Endereco } from "../../models/endereco.model"
import { AuthService } from "../../services/auth.service"
import { EnderecoService } from "../../services/endereco.service"
import { tap } from "rxjs"
import { CartaoService } from "../../services/cartao.service"
import { Cartao, CartaoRetorno } from "../../models/cartao.model"
import { Produto } from "../../models/Produto.model"
import { CupomService } from "../../services/cupom.service"
import { Cupom } from "../../models/cupom.model"

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
  produtos: Produto[] = []
  desconto = 0
  showInstallments = false
  cupomAplicado = false
  codigoPromocional = ""
  formPagamento!: FormGroup; 
  formEndereco!: FormGroup;
  enderecos: Endereco[] = []
  cupom: Cupom | undefined  

  installmentOptions: { text: string; value: string }[] = []
  parcelaSelecionada: { text: string; value: string } | null = null;

  get formaPagamentoSelecionada(): string {
    return this.formPagamento.get('formaPagamento')?.value;
  }

  get selecionarEndereco(): string {
    return this.formEndereco.get('selecionarEndereco')?.value;
  }


  selecionarParcela(option: { text: string; value: string }) {
    this.parcelaSelecionada = option;
  }  

  cartoes: CartaoRetorno[] = []

  cartaoSelecionado: any = null;
  
  selecionarCartao(cartao: CartaoRetorno) {
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
    private fb: FormBuilder,
    private authService: AuthService,
    private enderecoService: EnderecoService,
    private cartoesService: CartaoService,
    private cupomService: CupomService,
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

    this.cartoesService.findAll().pipe(
        tap((cartoes) => {
          this.cartoes = cartoes
        })
      ).subscribe();

    this.formEndereco = this.fb.group({
      selecionarEndereco: ['']
    });

    this.enderecoService.findAll().pipe(
      tap((enderecos) => {
        this.enderecos = enderecos;
      })
    ).subscribe();
  }

  adicionarEndereco(): void {
    this.router.navigate(['/enderecos/adicionar']);
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
          let descontoCupom: number = 1
          console.log("desocnot")
          if(this.cupom?.desconto != undefined){
            descontoCupom = 1-this.cupom?.desconto || 1
            console.log(descontoCupom)
          }
          if (prod.desconto != undefined) {
            total += prod.preco * prod.quantidade - prod.desconto * prod.quantidade * descontoCupom
            desconto += prod.desconto * prod.quantidade
          } else {
            total += prod.preco * prod.quantidade * descontoCupom
          }
          nomes.push(prod.nome)
        }
      })

      this.valorParaPagar = total
      this.carrinhoService.obterProdutos().subscribe(produtos => {
        this.produtos = produtos;
      })
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
    this.cupomService.findByCodigo(this.codigoPromocional).subscribe(cp => {

      if(!cp){
         throw "Cupom não econtrado!"
      }

      this.cupom = cp
      this.calcularValorAPagar()
    })
  }

  aumentarQuantidade(produtoId: number): void {
    this.carrinhoService.aumentarQuantidade(produtoId)
  }

  diminuirQuantidade(produtoId: number): void {
    this.carrinhoService.diminuirQuantidade(produtoId)
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
    this.router.navigate(["/home"])
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
    
    if (this.produtos.length === 0) {
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
  
      this.produtos = [];
      this.router.navigate(["/confirmacao-pedido"]);
    }, 2000);
  }  
}

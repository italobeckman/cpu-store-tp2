import { Component, type OnInit, OnDestroy } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { tap } from "rxjs";

// Angular Material
import { MatIconModule, MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatDivider, MatList, MatListItem } from "@angular/material/list";
import { MatFormField, MatLabel, MatOption } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

// Serviços e Models
import { AuthService } from "../../services/auth.service";
import { EnderecoService } from "../../services/endereco.service";
import { CartaoService } from "../../services/cartao.service";
import { CupomService } from "../../services/cupom.service";

import { PagamentoService } from "../../services/pagamento.service";

import { Produto } from "../../models/Produto.model";
import { Endereco } from "../../models/endereco.model";
import { CartaoRetorno } from "../../models/cartao.model";
import { Cupom } from "../../models/cupom.model";
import { CarrinhoService } from "../../services/carrinho.service";

interface PedidoRequest {
  enderecoId: number;
  formaPagamento: string;
  cartaoId?: number;
  parcelas?: number;
  cupomId?: number;
  itens: {
    produtoId: number;
    quantidade: number;
  }[];
}
import { PedidoService } from "../../services/pedido.service"
import { PedidosService } from "../../services/pedidos.service";
import { ConfirmarPagamentoDialogComponent } from "./ComfirmarPagamentoDialogComponent";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-pagamento",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatProgressSpinnerModule,
  ],
  // Remove the Stripe providers from here
  templateUrl: "./pagamento.component.html",
  styleUrls: ["./pagamento.component.css"],
})
export class ResumoPagamentoComponent implements OnInit, OnDestroy {
  valorParaPagar = 0;
  produtos: Produto[] = [];
  enderecos: Endereco[] = [];
  cartoes: CartaoRetorno[] = [];
  cupomAplicado: Cupom | null = null;
  isProcessing = false;
  desconto = 0;
  showInstallments = false;
  codigoPromocional = "";

  formEndereco!: FormGroup;
  formPagamento!: FormGroup;

  cartaoSelecionado: CartaoRetorno | null = null;
  isMobile = false;

  installmentOptions: { text: string; value: string }[] = [];
  parcelaSelecionada: { text: string; value: string } | null = null;

  get podeFinalizarCompra(): boolean {
    const enderecoSelecionado = this.formEndereco.get('selecionarEndereco')?.value;
    const formaPagamento = this.formPagamento.get('formaPagamento')?.value;

    if (!enderecoSelecionado) return false;

    if (formaPagamento === 'cartao') {
      return !!this.cartaoSelecionado && !!this.parcelaSelecionada;
    }

    return true;
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
    private pedidoService: PedidosService,
    private pagamentoService: PagamentoService,
    private dialog: MatDialog, 
  ) {}

  ngOnInit(): void {
    this.calcularValorAPagar();
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize.bind(this));

    this.formPagamento = this.fb.group({
      formaPagamento: ['pix'],
      parcelaSelecionada: ['']
    });

    this.cartoesService.findAll().pipe(
      tap(cartoes => {
        this.cartoes = cartoes;
        this.gerarOpcoesParcelamento(this.valorParaPagar);
      })
    ).subscribe();

    this.formEndereco = this.fb.group({
      selecionarEndereco: ['']
    });

    this.enderecoService.findAll().pipe(
      tap(enderecos => this.enderecos = enderecos)
    ).subscribe();
  }

  get formaPagamentoSelecionada(): string {
    return this.formPagamento.get('formaPagamento')?.value;
  }

  

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.checkScreenSize.bind(this));
  }

  selecionarCartao(cartao: CartaoRetorno) {
    this.cartaoSelecionado = cartao;
  }

  adicionarCartao() {
    this.router.navigate(['pagamento/adicionar_cartao']);
  }

  selecionarParcela(option: { text: string; value: string }) {
    this.parcelaSelecionada = option;
  }

  toggleInstallments(): void {
    this.showInstallments = !this.showInstallments;
  }

  gerarOpcoesParcelamento(total: number): void {
    this.installmentOptions = [];
    const maxParcelas = total >= 1000 ? 12 : total >= 500 ? 6 : 3;

    for (let i = 1; i <= maxParcelas; i++) {
      const valorParcela = total / i;
      this.installmentOptions.push({
        text: `${i}x de R$ ${valorParcela.toFixed(2)}`,
        value: i === 1 ? "à vista" : "sem juros",
      });
    }
  }

  aumentarQuantidade(produtoId: number): void {
    this.carrinhoService.aumentarQuantidade(produtoId);
    this.calcularValorAPagar();
  }

  diminuirQuantidade(produtoId: number): void {
    this.carrinhoService.diminuirQuantidade(produtoId);
    this.calcularValorAPagar();
  }

  removerItem(produtoNome: string): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      const produto = produtos.find((p) => p.nome === produtoNome);
      if (produto) {
        this.carrinhoService.removerProduto(produto.id);
        this.calcularValorAPagar();

        this.snackBar.open("Item removido do carrinho", "Fechar", {
          duration: 3000,
        });
      }
    });
  }

  continuarComprando(): void {
    this.router.navigate(["/home"]);
  }

  adicionarEndereco(): void {
    this.router.navigate(['/enderecos/adicionar']);
  }

  finalizarCompra(): void {
    if (this.produtos.length === 0) {
      this.snackBar.open("Seu carrinho está vazio", "Fechar", { duration: 3000 });
      return;
    }

    const idEndereco = this.formEndereco.get('selecionarEndereco')?.value;
    const listaItemPedido = this.produtos.map(prod => ({
      idProcessador: prod.id,
      quantidade: prod.quantidade
    }));

    const pedidoRequest = {
      idEndereco,
      listaItemPedido
    };

    this.isProcessing = true;

    this.pedidoService.createPedido(pedidoRequest).subscribe({
      next: pedidoCriado => {
        const pedidoId = pedidoCriado.id;

        switch (this.formaPagamentoSelecionada) {
          case 'cartao':
            if (!this.cartaoSelecionado) {
              this.snackBar.open("Selecione um cartão para pagamento", "Fechar", { duration: 3000 });
              this.isProcessing = false;
              return;
            }

            const dialogRef = this.dialog.open(ConfirmarPagamentoDialogComponent, {
              data: {
                cartao: this.cartaoSelecionado,
                valor: this.valorParaPagar,
                parcela: this.parcelaSelecionada
              }
            });
            dialogRef.afterClosed().subscribe(confirmado => {
            if (!confirmado) {
              this.isProcessing = false;
              return;
            }

            // Código original mantido exatamente igual:
            this.pagamentoService.pagarComCartao(this.cartaoSelecionado?.id, pedidoId).subscribe({
              next: () => this.finalizarSucesso(),
              error: this.finalizarErro.bind(this)
            });
          });
          break;

          case 'pix':
            this.pagamentoService.generatePix(pedidoId).subscribe({
              next: pixResponse => {
                this.pagamentoService.pagarComPix(pedidoId, pixResponse.id).subscribe({
                  next: () => this.finalizarSucesso(),
                  error: this.finalizarErro.bind(this)
                });
              },
              error: this.finalizarErro.bind(this)
            });
            break;

          case 'boleto':
            this.pagamentoService.generateBoleto(pedidoId).subscribe({
              next: boletoResponse => {
                this.pagamentoService.pagarComBoleto(pedidoId, boletoResponse.id).subscribe({
                  next: () => this.finalizarSucesso(),
                  error: this.finalizarErro.bind(this)
                });
              },
              error: this.finalizarErro.bind(this)
            });
            break;

          default:
            this.finalizarSucesso();
        }
      },
      error: this.finalizarErro.bind(this)
    });
  }

  private finalizarSucesso(): void {
    this.snackBar.open("Compra finalizada com sucesso!", "Fechar", {
      duration: 5000,
      panelClass: ["success-snackbar"],
    });
    this.produtos = [];
    this.isProcessing = false;
    this.router.navigate(["/pedidos"]);
  }

  private finalizarErro(error: any): void {
    console.error(error);
    this.snackBar.open("Erro ao finalizar compra", "Fechar", {
      duration: 3000,
      panelClass: ["error-snackbar"],
    });
    this.isProcessing = false;
  }

  private calcularValorAPagar(): void {
    this.carrinhoService.obterProdutos().subscribe((produtos) => {
      let total = 0;
      let desconto = 0;

      produtos.forEach((prod) => {
        if (prod.quantidade > 0) {
          let descontoCupom: number = 1;
          if(this.cupomAplicado?.desconto != undefined){
            descontoCupom = 1 - this.cupomAplicado.desconto || 1;
          }
          if (prod.desconto != undefined) {
            total += prod.preco * prod.quantidade - prod.desconto * prod.quantidade * descontoCupom;
            desconto += prod.desconto * prod.quantidade;
          } else {
            total += prod.preco * prod.quantidade * descontoCupom;
          }
        }
      });

      this.valorParaPagar = total;
      this.produtos = produtos;
      this.desconto = desconto;
      this.gerarOpcoesParcelamento(total);
    });
  }

  aplicarCupom(): void {
    this.cupomService.validarCupom(this.codigoPromocional).subscribe({
      next: (cupom) => {
        this.cupomAplicado = cupom;
        this.calcularValorAPagar();
        this.snackBar.open("Cupom aplicado com sucesso!", "Fechar", { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Cupom inválido", "Fechar", { duration: 3000 });
      }
    });
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    const container = document.querySelector(".pagamento-container");
    if (container) {
      if (this.isMobile) {
        container.classList.add("mobile-view");
      } else {
        container.classList.remove("mobile-view");
      }
    }
  }
}
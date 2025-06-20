import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDialog } from "@angular/material/dialog"
import { PedidoService, PedidoBasicResponseDTO } from "../../services/pedido.service" // importe o serviço
import { PedidoDetalhesDialogComponent } from "./pedido-detalhes-dialog/pedido-detalhes-dialog.component"
import { ProcessadorService } from "../../services/processador.service"

interface ItemPedido {
  id: number
  nome: string
  quantidade: number
  precoUnitario: number
}

interface Pedido {
  id: number
  dataPedido: Date
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado"
  itens: ItemPedido[]
  subtotal: number
  desconto: number
  frete: number
  total: number
  codigoRastreamento?: string
  enderecoEntrega: string
  formaPagamento: string
}

@Component({
  selector: "app-pedidos",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./pedidos.component.html",
  styleUrls: ["./pedidos.component.css"],
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = []
  pedidosFiltrados: Pedido[] = []
  isLoading = true
  errorMessage = ""
  filtroStatus = ""
  filtroTexto = ""
  constructor(private pedidoService: PedidoService, private dialog: MatDialog, private processadorService: ProcessadorService) {} // injete o serviço

  ngOnInit(): void {
    this.loadPedidos()
  }

  private mapStatus(status: string): "pendente" | "processando" | "enviado" | "entregue" | "cancelado" {
    switch (status) {
      case "PENDENTE":
        return "pendente"
      case "PREPARANDO_PRODUTO":
      case "PROCESSANDO":
        return "processando"
      case "ENVIADO":
        return "enviado"
      case "ENTREGUE":
        return "entregue"
      case "PEDIDO_CANCELADO":
        return "cancelado"
      default:
        return "pendente" 
    }
  }

  loadPedidos(): void {
    this.isLoading = true
    this.errorMessage = ""

    this.pedidoService.listarPedidos().subscribe({
      next: (dados: PedidoBasicResponseDTO[]) => {
        console.log("Pedidos recebidos:", dados)
        this.pedidos = dados.map((dto) => ({
          id: dto.id,
          dataPedido: new Date(dto.data),
          status: this.mapStatus(dto.statusPedido), 
          itens: dto.listaItemPedido.map((item) => ({
            id: item.idProcessador,
            nome: item.nome,
            quantidade: item.quantidade,
            precoUnitario: item.valor,
            imageUrl: item.imageUrl && item.imageUrl.length > 0
              ? this.processadorService.getImageUrl(item.imageUrl[0])
              : "/img/processor-placeholder.png",
          })),
          subtotal: dto.valorTotal,
          desconto: 0,
          frete: 0,
          total: dto.valorTotal,
          codigoRastreamento: "",
          enderecoEntrega: dto.enderecoEntrega
            ? `${"Logradouro " + dto.enderecoEntrega.logradouro}, ${dto.enderecoEntrega.numero}, ${dto.enderecoEntrega.bairro}, ${dto.enderecoEntrega.cidade.nome} - ${dto.enderecoEntrega.cidade.estado.nome}, CEP: ${dto.enderecoEntrega.cep}`
            : "Endereço não disponível",
          formaPagamento: dto.formaPagamento,
        }))
        this.pedidosFiltrados = [...this.pedidos]
        this.isLoading = false
      },
      error: (error) => {
        console.error("Erro ao carregar pedidos:", error)
        this.errorMessage = "Não foi possível carregar os pedidos. Tente novamente mais tarde."
        this.isLoading = false
      },
    })
  }

  filtrarPedidos(): void {
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      const matchStatus = !this.filtroStatus || pedido.status === this.filtroStatus
      const matchTexto =
        !this.filtroTexto ||
        pedido.id.toString().includes(this.filtroTexto) ||
        pedido.itens.some((item) => item.nome.toLowerCase().includes(this.filtroTexto.toLowerCase()))

      return matchStatus && matchTexto
    })
  }

  getTotalGasto(): number {
    return this.pedidos
    .filter(p => p.status !== 'cancelado')
    .reduce((total, p) => total + (p.total || 0), 0);
  }

  getTotalGastoNaoCancelado(): number {
    return this.pedidos
      .filter(p => p.status !== 'cancelado')
      .reduce((total, p) => total + (p.total || 0), 0);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pendente: "Pendente",
      processando: "Processando",
      enviado: "Enviado",
      entregue: "Entregue",
      cancelado: "Cancelado",
    }
    return labels[status] || status
  }



  cancelarPedido(pedido: Pedido): void {
    if (confirm(`Tem certeza que deseja cancelar o pedido #${pedido.id}?`)) {
      console.log("Cancelar pedido:", pedido.id)

      this.pedidoService.cancelarPedido(pedido.id).subscribe({
        next: () => {
          console.log("Pedido cancelado com sucesso:", pedido.id)
          pedido.status = "cancelado"
        },
        error: (error) => {
          console.error("Erro ao cancelar pedido:", error)
          alert("Não foi possível cancelar o pedido. Tente novamente mais tarde.")
        }
      })

      this.filtrarPedidos()
    }
  }

  comprarNovamente(pedido: Pedido): void {
    console.log("Comprar novamente pedido:", pedido.id)
    // Implementar lógica para adicionar itens ao carrinho
    // this.carrinhoService.adicionarItens(pedido.itens);
    // this.router.navigate(['/carrinho']);
  }

  handleImageError(event: any): void {
    event.target.src = "/placeholder.svg?height=80&width=80"
  }

  verDetalhes(pedido: Pedido): void {
    const dialogRef = this.dialog.open(PedidoDetalhesDialogComponent, {
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      data: pedido,
      panelClass: "pedido-detalhes-dialog",
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "cancelar") {
        // Recarregar pedidos se foi cancelado
        this.loadPedidos()
      }
    })
  }
}

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
import { PedidoService, PedidoBasicResponseDTO } from "../../services/pedido.service" // importe o serviço

interface ItemPedido {
  id: number
  nome: string
  especificacoes: string
  quantidade: number
  precoUnitario: number
  imagemUrl?: string
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

  constructor(private pedidoService: PedidoService) {} // injete o serviço

  ngOnInit(): void {
    this.loadPedidos()
  }

  loadPedidos(): void {
    this.isLoading = true
    this.errorMessage = ""

    this.pedidoService.listarPedidos().subscribe({
      next: (dados: PedidoBasicResponseDTO[]) => {
        this.pedidos = dados.map((dto) => ({
          id: dto.id,
          dataPedido: new Date(dto.data),
          status: "entregue", // Valor padrão, pois o DTO não traz status
          itens: [], // Vazio, pois o DTO não traz itens
          subtotal: dto.valorTotal,
          desconto: 0,
          frete: 0,
          total: dto.valorTotal,
          codigoRastreamento: "",
          enderecoEntrega: "",
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
    return this.pedidos.reduce((total, pedido) => total + pedido.total, 0)
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

  verDetalhes(pedido: Pedido): void {
    console.log("Ver detalhes do pedido:", pedido.id)
    // Implementar navegação para página de detalhes
    // this.router.navigate(['/pedidos', pedido.id]);
  }

  rastrearPedido(pedido: Pedido): void {
    if (pedido.codigoRastreamento) {
      console.log("Rastrear pedido:", pedido.codigoRastreamento)
      // Implementar redirecionamento para página de rastreamento
      window.open(`https://www.correios.com.br/rastreamento?codigo=${pedido.codigoRastreamento}`, "_blank")
    }
  }

  cancelarPedido(pedido: Pedido): void {
    if (confirm(`Tem certeza que deseja cancelar o pedido #${pedido.id}?`)) {
      console.log("Cancelar pedido:", pedido.id)
      // Implementar lógica de cancelamento
      pedido.status = "cancelado"
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
}

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

  ngOnInit(): void {
    this.loadPedidos()
  }

  loadPedidos(): void {
    this.isLoading = true
    this.errorMessage = ""

    // Simulando carregamento de dados
    setTimeout(() => {
      try {
        // Dados mockados de pedidos
        this.pedidos = [
          {
            id: 1001,
            dataPedido: new Date("2024-01-15T10:30:00"),
            status: "entregue",
            itens: [
              {
                id: 1,
                nome: "Intel Core i7-13700K",
                especificacoes: "Socket LGA1700, 16 núcleos, 24 threads",
                quantidade: 1,
                precoUnitario: 2299.99,
                imagemUrl: "/placeholder.svg?height=80&width=80",
              },
              {
                id: 2,
                nome: "AMD Ryzen 5 7600X",
                especificacoes: "Socket AM5, 6 núcleos, 12 threads",
                quantidade: 2,
                precoUnitario: 1599.99,
                imagemUrl: "/placeholder.svg?height=80&width=80",
              },
            ],
            subtotal: 5499.97,
            desconto: 200.0,
            frete: 0,
            total: 5299.97,
            codigoRastreamento: "BR123456789",
            enderecoEntrega: "Rua das Flores, 123 - São Paulo, SP",
            formaPagamento: "Cartão de Crédito",
          },
          {
            id: 1002,
            dataPedido: new Date("2024-01-20T14:15:00"),
            status: "enviado",
            itens: [
              {
                id: 3,
                nome: "Intel Core i5-13400F",
                especificacoes: "Socket LGA1700, 10 núcleos, 16 threads",
                quantidade: 1,
                precoUnitario: 1299.99,
                imagemUrl: "/placeholder.svg?height=80&width=80",
              },
            ],
            subtotal: 1299.99,
            desconto: 50.0,
            frete: 29.9,
            total: 1279.89,
            codigoRastreamento: "BR987654321",
            enderecoEntrega: "Av. Paulista, 456 - São Paulo, SP",
            formaPagamento: "PIX",
          },
          {
            id: 1003,
            dataPedido: new Date("2024-01-25T09:45:00"),
            status: "processando",
            itens: [
              {
                id: 4,
                nome: "AMD Ryzen 9 7900X",
                especificacoes: "Socket AM5, 12 núcleos, 24 threads",
                quantidade: 1,
                precoUnitario: 3199.99,
                imagemUrl: "/placeholder.svg?height=80&width=80",
              },
            ],
            subtotal: 3199.99,
            desconto: 0,
            frete: 0,
            total: 3199.99,
            enderecoEntrega: "Rua dos Processadores, 789 - Rio de Janeiro, RJ",
            formaPagamento: "Boleto Bancário",
          },
          {
            id: 1004,
            dataPedido: new Date("2024-01-28T16:20:00"),
            status: "pendente",
            itens: [
              {
                id: 5,
                nome: "Intel Core i3-13100F",
                especificacoes: "Socket LGA1700, 4 núcleos, 8 threads",
                quantidade: 3,
                precoUnitario: 699.99,
                imagemUrl: "/placeholder.svg?height=80&width=80",
              },
            ],
            subtotal: 2099.97,
            desconto: 100.0,
            frete: 19.9,
            total: 2019.87,
            enderecoEntrega: "Rua da Tecnologia, 321 - Belo Horizonte, MG",
            formaPagamento: "Cartão de Débito",
          },
        ]

        this.pedidosFiltrados = [...this.pedidos]
        this.isLoading = false
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
        this.errorMessage = "Não foi possível carregar os pedidos. Tente novamente mais tarde."
        this.isLoading = false
      }
    }, 1500)
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

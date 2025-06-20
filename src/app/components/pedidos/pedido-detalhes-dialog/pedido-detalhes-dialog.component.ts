import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { PedidoService } from "../../../services/pedido.service"

interface ItemPedido {
  id: number
  nome: string
  quantidade: number
  precoUnitario: number
  imageUrl?: string
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
  selector: "app-pedido-detalhes-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: "./pedido-detalhes-dialog.component.html",
  styleUrls: ["./pedido-detalhes-dialog.component.css"],
})
export class PedidoDetalhesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PedidoDetalhesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pedido,
    private readonly pedidoService: PedidoService,
  ) { }

  fechar(): void {
    this.dialogRef.close()
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

  isStatusActive(status: string): boolean {
    return this.data.status === status
  }

  isStatusCompleted(status: string): boolean {
    const statusOrder = ["pendente", "processando", "enviado", "entregue"]
    const currentIndex = statusOrder.indexOf(this.data.status)
    const checkIndex = statusOrder.indexOf(status)
    return currentIndex > checkIndex
  }



  cancelarPedido(): void {
    if (confirm(`Tem certeza que deseja cancelar o pedido #${this.data.id}?`)) {
      this.pedidoService.cancelarPedido(this.data.id).subscribe({
        next: () => {
          console.log("Pedido cancelado com sucesso:", this.data.id)
          this.dialogRef.close("cancelar")
        },
        error: (error) => {
          console.error("Erro ao cancelar pedido:", error)
          alert("Não foi possível cancelar o pedido. Tente novamente mais tarde.")
        },
      })
    }
  }
}

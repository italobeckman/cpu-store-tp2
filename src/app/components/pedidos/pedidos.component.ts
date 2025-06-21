import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from "@angular/material/dialog";
import { PedidoService, PedidoBasicResponseDTO } from "../../services/pedido.service";
import { PedidoDetalhesDialogComponent } from "./pedido-detalhes-dialog/pedido-detalhes-dialog.component";
import { ProcessadorService } from "../../services/processador.service";

interface ItemPedido {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  imageUrl: string; 
}

interface Pedido {
  id: number;
  dataPedido: Date;
  statusPedido: string; 
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  codigoRastreamento?: string;
  enderecoEntrega: string;
  formaPagamento: string;
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
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  isLoading = true;
  errorMessage = "";
  filtroStatus = "";
  filtroTexto = "";

  statusOptions = [
    { value: "PAGAMENTO_PENDENTE", label: "Pagamento pendente" },
    { value: "PREPARANDO_PRODUTO", label: "Preparando produto" },
    { value: "PROCESSANDO", label: "Processando" },
    { value: "PRODUTO_ENVIADO", label: "Produto enviado" },
    { value: "PRODUTO_ENTREGUE", label: "Produto entregue" },
    { value: "PEDIDO_CANCELADO", label: "Pedido cancelado" },
    { value: "PEDIDO_EXPIRADO", label: "Pedido expirado" },
    { value: "PRODUTO_DEVOLVIDO", label: "Produto devolvido" },
  ];

  private readonly statusLabels: { [key: string]: string } = {
    PAGAMENTO_PENDENTE: "Pagamento pendente",
    PREPARANDO_PRODUTO: "Preparando produto",
    PROCESSANDO: "Processando",
    PRODUTO_ENVIADO: "Produto enviado",
    PRODUTO_ENTREGUE: "Produto entregue",
    PEDIDO_CANCELADO: "Pedido cancelado",
    PEDIDO_EXPIRADO: "Pedido expirado",
    PRODUTO_DEVOLVIDO: "Produto devolvido",
  };

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog,
    private processadorService: ProcessadorService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.pedidoService.listarPedidos().subscribe({
      next: (dados: PedidoBasicResponseDTO[]) => {
        this.pedidos = dados.map((dto) => ({
          id: dto.id,
          dataPedido: new Date(dto.data),
          statusPedido: dto.statusPedido,
          itens: dto.listaItemPedido.map((item) => ({
            id: item.idProcessador,
            nome: item.nome,
            quantidade: item.quantidade,
            precoUnitario: item.valor,
            imageUrl:
              item.imageUrl && item.imageUrl.length > 0
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
        }));
        this.filtrarPedidos(); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar pedidos:", error);
        this.errorMessage = "Não foi possível carregar os pedidos. Tente novamente mais tarde.";
        this.isLoading = false;
      },
    });
  }

  filtrarPedidos(): void {
    let pedidosTemp = [...this.pedidos];

    // Filtro por Status
    if (this.filtroStatus) {
      pedidosTemp = pedidosTemp.filter((pedido) => pedido.statusPedido === this.filtroStatus);
    }

    if (this.filtroTexto) {
      const textoBusca = this.filtroTexto.toLowerCase().trim();
      pedidosTemp = pedidosTemp.filter(
        (pedido) =>
          pedido.id.toString().includes(textoBusca) ||
          pedido.itens.some((item) => item.nome.toLowerCase().includes(textoBusca))
      );
    }
    
    this.pedidosFiltrados = pedidosTemp;
  }

  getTotalGasto(): number {
    const statusNaoContabilizados = ['PEDIDO_CANCELADO', 'PEDIDO_EXPIRADO', 'PAGAMENTO_PENDENTE'];
    return this.pedidos
      .filter(p => !statusNaoContabilizados.includes(p.statusPedido))
      .reduce((total, p) => total + (p.total || 0), 0);
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] || status;
  }

  cancelarPedido(pedido: Pedido): void {
    if (confirm(`Tem certeza que deseja cancelar o pedido #${pedido.id}?`)) {
      this.pedidoService.cancelarPedido(pedido.id).subscribe({
        next: () => {
          console.log("Pedido cancelado com sucesso:", pedido.id);
          pedido.statusPedido = "PEDIDO_CANCELADO";
          this.filtrarPedidos();
        },
        error: (error) => {
          console.error("Erro ao cancelar pedido:", error);
          alert("Não foi possível cancelar o pedido. Tente novamente mais tarde.");
        },
      });
    }
  }

  verDetalhes(pedido: Pedido): void {
    const dialogRef = this.dialog.open(PedidoDetalhesDialogComponent, {
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      data: pedido,
      panelClass: "pedido-detalhes-dialog",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "cancelar") {
        this.loadPedidos(); 
      }
    });
  }
}
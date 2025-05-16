import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"

@Component({
  selector: "app-confirmacao-pedido",
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: "./confirmacao-pedido.component.html",
  styleUrls: ["./confirmacao-pedido.component.css"],
})
export class ConfirmacaoPedidoComponent implements OnInit {
  numeroPedido = ""
  dataEntrega = ""
  today = new Date() // Adicione esta propriedade

  constructor() {}

  ngOnInit(): void {
    // Gerar número de pedido aleatório
    this.numeroPedido = this.gerarNumeroPedido()

    // Calcular data estimada de entrega (7 dias úteis a partir de hoje)
    this.dataEntrega = this.calcularDataEntrega(7)
  }

  private gerarNumeroPedido(): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let resultado = ""

    // Gerar parte numérica
    const numeroAleatorio = Math.floor(100000 + Math.random() * 900000)

    // Gerar parte alfabética (3 letras)
    for (let i = 0; i < 3; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * 26))
    }

    return `${resultado}-${numeroAleatorio}`
  }

  private calcularDataEntrega(diasUteis: number): string {
    const data = new Date()
    let diasAdicionados = 0

    while (diasAdicionados < diasUteis) {
      data.setDate(data.getDate() + 1)

      // Pular finais de semana (0 = Domingo, 6 = Sábado)
      if (data.getDay() !== 0 && data.getDay() !== 6) {
        diasAdicionados++
      }
    }

    // Formatar data para DD/MM/YYYY
    return `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`
  }
}

import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"

// Angular Material Imports
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  currentYear = new Date().getFullYear()
  emailSubscription = ""

  // Links de navegação do footer
  footerLinks = [
    {
      category: "Comprar",
      links: [
        { label: "Todos os Produtos", url: "/produtos" },
        { label: "Novidades", url: "/produtos/novidades" },
        { label: "Mais Vendidos", url: "/produtos/mais-vendidos" },
        { label: "Ofertas e Promoções", url: "/ofertas" },
        { label: "Cartões de Presente", url: "/cartoes-presente" },
      ],
    },
    {
      category: "Atendimento ao Cliente",
      links: [
        { label: "Central de Ajuda", url: "/ajuda" },
        { label: "Status do Pedido", url: "/pedidos/status" },
        { label: "Frete e Entrega", url: "/frete" },
        { label: "Trocas e Devoluções", url: "/trocas" },
        { label: "Fale Conosco", url: "/contato" },
      ],
    },
    {
      category: "Sobre Nós",
      links: [
        { label: "Nossa História", url: "/sobre" },
        { label: "Trabalhe Conosco", url: "/carreiras" },
        { label: "Imprensa", url: "/imprensa" },
        { label: "Blog", url: "/blog" },
        { label: "Sustentabilidade", url: "/sustentabilidade" },
      ],
    },
  ]

  // Links de redes sociais
  socialLinks = [
    { icon: "facebook", url: "https://facebook.com", label: "Facebook" },
    { icon: "twitter", url: "https://twitter.com", label: "Twitter" },
    { icon: "instagram", url: "https://instagram.com", label: "Instagram" },
    { icon: "youtube", url: "https://youtube.com", label: "YouTube" },
    { icon: "pinterest", url: "https://pinterest.com", label: "Pinterest" },
  ]

  // Métodos de pagamento
  paymentMethods = [
    { icon: "credit_card", label: "Cartão de Crédito" },
    { icon: "account_balance", label: "Transferência Bancária" },
    { icon: "payments", label: "Boleto" },
  ]

  inscreverNewsletter() {
    if (this.emailSubscription && this.validateEmail(this.emailSubscription)) {
      console.log("Inscrevendo email:", this.emailSubscription)
      // Aqui você implementaria a lógica real de inscrição
      alert(`Obrigado por se inscrever com ${this.emailSubscription}!`)
      this.emailSubscription = ""
    } else {
      alert("Por favor, insira um endereço de e-mail válido")
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }
}

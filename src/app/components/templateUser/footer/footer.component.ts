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
        { label: "Mais Vendidos", url: "/home" },
      ],
    },
    {
      category: "Atendimento ao Cliente",
      links: [
        { label: "Central de Ajuda", url: "/sobre" },
        { label: "Fale Conosco", url: "/sobre" },
      ],
    },
    {
      category: "Sobre Nós",
      links: [
        { label: "Nossa História", url: "/sobre" },
        { label: "Trabalhe Conosco", url: "/sobre" },
        { label: "Imprensa", url: "/sobre" },
        { label: "Blog", url: "/sobre" },
        { label: "Sustentabilidade", url: "/sobre" },
      ],
    },
  ]

  paymentMethods = [
    { icon: "credit_card", label: "Cartão de Crédito" },
    { icon: "account_balance", label: "Transferência Bancária" },
    { icon: "payments", label: "Boleto" },
    { icon: "pix", label: "PIX" },

    
  ]

  inscreverNewsletter() {
    if (this.emailSubscription && this.validateEmail(this.emailSubscription)) {
      console.log("Inscrevendo email:", this.emailSubscription)



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

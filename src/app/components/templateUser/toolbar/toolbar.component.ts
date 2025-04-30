import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink, RouterModule, RouterOutlet } from "@angular/router"

// Angular Material Imports
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatBadgeModule } from "@angular/material/badge"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"

@Component({
  selector: "app-toolbar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet
  ],
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"],
})
export class ToolbarComponent implements OnInit {
  searchQuery = ""
  cartItemCount = 3
  isMobileMenuOpen = false

  // Example navigation items
  navItems = [
    { label: "Início", link: "/home", icon: "home" },
    { label: "Produtos", link: "/products", icon: "category" },
    { label: "Ofertas", link: "/deals", icon: "local_offer" },
    { label: "Sobre", link: "/about", icon: "info" },
    { label: "Contato", link: "/contact", icon: "contact_support" },
]

  constructor() {}

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log("Searching for:", this.searchQuery)
      // Implement search logic
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false
  }
}

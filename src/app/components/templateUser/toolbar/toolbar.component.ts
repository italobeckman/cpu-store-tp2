import { Component, OnDestroy, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SearchService } from '../../../services/search.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-toolbar',
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
    RouterOutlet,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  searchQuery = '';
  cartItemCount = 3;
  isMobileMenuOpen = false;
  usuarioLogado: Usuario | null = null;
  username: string | null = '';
  isloogedIn: boolean = false;
  
  private subscription = new Subscription();

  // Example navigation items
  navItems = [
    { label: 'Início', link: '/home', icon: 'home' },
    { label: 'Produtos', link: '/products', icon: 'category' },
    { label: 'Ofertas', link: '/deals', icon: 'local_offer' },
    { label: 'Sobre', link: '/about', icon: 'info' },
    { label: 'Contato', link: '/contact', icon: 'contact_support' },
  ];

  constructor(
    private searchService: SearchService,
    private router: Router,
    private authService: AuthService
  ) {}
isLoggedIn(): boolean {
  return !!localStorage.getItem('jwt_token');
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnInit(): void {

    this.username = this.authService.getUsername();
    this.obterUsuarioLogado();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      this.searchService.updateQuery(this.searchQuery);
      this.router.navigate(['/home'], {
        queryParams: { search: this.searchQuery },
      });
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  
  obterUsuarioLogado() {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.usuarioLogado = usuario;
        console.log(this.usuarioLogado); // Agora mostra o valor correto
      })
    );
  }
  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    
    location.reload();
  }
}

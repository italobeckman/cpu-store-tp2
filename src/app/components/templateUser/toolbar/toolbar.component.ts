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
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { CarrinhoService } from '../../../services/carrinho.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
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
  cartItemCount: number = 0;
  isMobileMenuOpen = false;
  usuarioLogado: Usuario | null = null;
  username: string | null = '';
  isloogedIn: boolean = false;

  private subscription = new Subscription();

  // Example navigation items
  navItems = [
    { label: 'Início', link: '/home', icon: 'home' },
    { label: 'Produtos', link: '/produtos', icon: 'category' },
    { label: 'Sobre', link: '/sobre', icon: 'info' },
  ];

  constructor(
    private searchService: SearchService,
    private router: Router,
    private authService: AuthService,
    private jwtHelperService: JwtHelperService,
    private carrinhoService: CarrinhoService 
  ) {}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.username = this.getUsernameFromToken();
    this.obterUsuarioLogado();
    this.atualizarContadorCarrinho();

    // Atualiza contador do carrinho em tempo real
    this.subscription.add(
      this.carrinhoService.obterProdutos().subscribe(produtos => {
        this.cartItemCount = produtos.reduce((total, item) => total + (item.quantidade || 1), 0);
      })
    );

    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.usuarioLogado = usuario;
        this.isloogedIn = !!usuario;
        const token = localStorage.getItem('jwt_token');
        if (token) {
          this.username = this.getUsernameFromToken();
          console.log('Usuário logado:', this.username);
        } else {
          this.username = null;
        }
      })
    );
  }

  onSearch() {
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.router.navigate(['/produtos'], { queryParams: { nome: this.searchQuery } });
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
      })
    );
  }
  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();

    location.reload();
  }

   public getTokenPayload(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  /**
   * Retorna um dado específico do token
   */
  public getClaimFromToken(token: string, claim: string): any {
    const payload: any = this.getTokenPayload(token);
    return payload ? payload[claim] : null;

  }

  public getUsernameFromToken(): string | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;

    return this.getClaimFromToken(token, 'preferred_username');

  }

  atualizarContadorCarrinho() {
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho') || '[]');
    this.cartItemCount = carrinho.reduce((total: number, item: any) => total + (item.quantidade || 1), 0);
  }
}


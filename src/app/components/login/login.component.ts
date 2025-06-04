import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')!.value;
      const password = this.loginForm.get('password')!.value;
      console.log(username, password);
      username.toLowerCase();

      this.carrinhoService.limparCarrinho();
      this.authService.login(username, password).subscribe({
        next: () => {
          console.log(username, password);
          if (
            this.authService.hasRole('Admin') ||
            this.authService.hasRole('SUPER')
          ) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.showSnackbarTopPosition(
            'Erro no login: ' + err.message,
            'Fechar',
            3000
          );
        },
      });
    } else {
      this.showSnackbarTopPosition('Dados inválidos', 'Fechar', 2000);
    }
  }

  onRegister() {
    // criar usuário
  }

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'center', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { UsuarioService } from '../../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterLink,
    MatIcon,
    MatCard,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  formCadastro!: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    protected router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.formCadastro = this.fb.group({
      username: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      dataNascimento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      categoria: ["USER"]
    });
  }

  async salvar(): Promise<void> {
    if (this.formCadastro.valid) {
      const usuario = this.formCadastro.value;
      console.log('Usuário a ser salvo:', usuario);
  
      try {
        (await this.usuarioService.insert(usuario)).subscribe({
          next: () => {
            // Sucesso no cadastro
            this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erro no cadastro:', err);
            
            // Verifica se é erro de CPF duplicado
            if (err.message?.includes('CPF já cadastrado') || 
                err.details?.includes('usuario_cpf_key')) {
              this.snackBar.open('CPF já cadastrado no sistema', 'Fechar', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              
              // Destaca o campo CPF no formulário
              this.formCadastro.get('cpf')?.setErrors({'duplicado': true});
            } else {
              // Outros erros
              this.snackBar.open(`Erro no cadastro: ${err.message || 'Erro desconhecido'}`, 'Fechar', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          }
        });
      } catch (error) {
        console.error('Erro ao tentar cadastrar:', error);
        this.snackBar.open('Erro ao tentar cadastrar, tente novamente', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      // Formulário inválido
      this.formCadastro.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos corretamente', 'Fechar', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    this.formCadastro.get('cpf')?.setValue(value, { emitEvent: false });
  }

  formatarTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 10) {
      value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }
    
    this.formCadastro.get('telefone')?.setValue(value, { emitEvent: false });
  }
}
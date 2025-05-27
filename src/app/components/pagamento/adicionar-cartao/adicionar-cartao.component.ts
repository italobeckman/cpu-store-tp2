import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TipoCartao } from '../../../models/cartao.model';
import { CartaoService } from '../../../services/cartao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar-cartao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './adicionar-cartao.component.html',
  styleUrl: './adicionar-cartao.component.css'
})
export class AdicionarCartaoComponent {
  formCartao: FormGroup;
  tiposCartao = Object.values(TipoCartao);

  // 👇 Correto: dentro da classe
  tipoCartaoMap: Record<string, number> = {
    CREDITO: 1,
    DEBITO: 2
  };

  constructor(private fb: FormBuilder, private cartaoService: CartaoService,private router: Router ) {
    this.formCartao = this.fb.group({
      nomeTitular: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      validade: ['', Validators.required],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      tipoCartao: ['', Validators.required]
    });
  }

  continuar() {
    if (this.formCartao.valid) {
      // 👇 Corrigido: criando uma cópia do form para modificar
      const formValue = { ...this.formCartao.value };

      // 👇 Converte string para número
      formValue.tipoCartao = this.tipoCartaoMap[formValue.tipoCartao];

      this.cartaoService.create(formValue).subscribe({
        next: (res) => {
          console.log('Cartão criado com sucesso:', res)
          this.router.navigate(['/pagamento']);  
        },
        error: (err) => console.error('Erro ao criar cartão:', err)
      });
    } else {
      this.formCartao.markAllAsTouched();
    }
  }
}

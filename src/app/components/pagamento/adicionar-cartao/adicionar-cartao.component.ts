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

@Component({
  selector: 'app-adicionar-cartao',
  standalone: true, // necessário para usar "imports"
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

  constructor(private fb: FormBuilder) {
    this.formCartao = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      nome: ['', Validators.required],
      vencimento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      codigoSeguranca: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      tipoDocumento: ['cpf', Validators.required],
      documento: ['', Validators.required]
    });
  }

  continuar() {
    if (this.formCartao.valid) {
      console.log('Cartão adicionado:', this.formCartao.value);
      // lógica para enviar ao backend ou próximo passo
    } else {
      this.formCartao.markAllAsTouched();
    }
  }
}

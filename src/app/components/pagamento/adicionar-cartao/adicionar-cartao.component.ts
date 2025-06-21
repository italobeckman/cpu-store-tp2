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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './adicionar-cartao.component.html',
  styleUrl: './adicionar-cartao.component.css'
})
export class AdicionarCartaoComponent {
  formCartao: FormGroup;
  tiposCartao = Object.values(TipoCartao);
  minDate = new Date();

  tipoCartaoMap: Record<string, number> = {
    'CREDITO': 1,
    'DEBITO': 2
  };

  constructor(
    private fb: FormBuilder, 
    private cartaoService: CartaoService,
    private router: Router
  ) {
    this.formCartao = this.fb.group({
      nomeTitular: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      validade: ['', [Validators.required, this.validadeValidator]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      tipoCartao: ['', Validators.required]
    });
  }

  // Validador personalizado para a data
  validadeValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const [year, month] = value.split('-').map(Number);
    const hoje = new Date();
    const dataValidade = new Date(year, month - 1);
    
    return dataValidade > hoje ? null : { dataInvalida: true };
  }

  formatarCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    this.formCartao.get('cpf')?.setValue(value, { emitEvent: false });
  }

  continuar() {
    if (this.formCartao.valid) {
      const formValue = { 
        ...this.formCartao.value,
        tipoCartao: this.tipoCartaoMap[this.formCartao.value.tipoCartao]
      };

      // Garantir que o CPF está no formato correto
      formValue.cpf = formValue.cpf.replace(/\D/g, '');

      console.log('JSON que será enviado:', JSON.stringify(formValue, null, 2));

      this.cartaoService.create(formValue).subscribe({
        next: (res) => {
          console.log('Cartão criado com sucesso:', res);
          this.router.navigate(['/pagamento']);  
        },
        error: (err) => {
          console.error('Erro ao criar cartão:', err);
          // Tratar erros específicos aqui
        }
      });
    } else {
      this.formCartao.markAllAsTouched();
    }
  }
}
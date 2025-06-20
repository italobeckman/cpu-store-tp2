import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LoteService } from '../../../services/lote.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ProcessadorService } from '../../../services/processador.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Processador } from '../../../models/processador.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Lote } from '../../../models/lote.model';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-lote-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgIf,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCardHeader, MatCardModule, MatIcon
  ],
  templateUrl: './lote-form.component.html',
  styleUrl: './lote-form.component.css'
})
export class LoteFormComponent {
  formGroup: FormGroup;
  processadores: Processador[] = [];
  fornecedores: Fornecedor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private fornecedorService: FornecedorService,
    private processadorService: ProcessadorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];

    this.formGroup = this.formBuilder.group({
      id: [(lote && lote.id) ? lote.id : null],
      idProcessador: [(lote && lote.idProcessador) ? lote.idProcessador : null, Validators.required],
      data: [(lote && lote.data) ? lote.data : '', Validators.required],
      codigo: [(lote && lote.codigo) ? lote.codigo : '', [Validators.required, Validators.maxLength(50)]],
      estoque: [(lote && lote.estoque) ? lote.estoque : '', Validators.required],
      idFornecedor: [(lote && lote.idFornecedor) ? lote.idFornecedor : '', Validators.required]
    });

    this.carregarProcessadores();
    this.carregarFornecedores();
  }

  carregarProcessadores() {
    this.processadorService.findAll().subscribe({
      next: (processadores) => {
        console.log('Processadores carregados:', processadores);
        this.processadores = processadores;
      },
      error: (error) => console.error('Erro ao carregar processadores:', error)
    });
  }

  carregarFornecedores() {
    this.fornecedorService.findAll().subscribe({
      next: (fornecedores) => this.fornecedores = fornecedores,
      error: (error) => console.error('Erro ao carregar fornecedores:', error)
    });
  }

  async salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const lote = {
        ...formValue,
        idProcessador: Number(formValue.idProcessador),
        idFornecedor: formValue.idFornecedor
      };

      const operacao = lote.id == null
        ? this.loteService.create(lote)
        : this.loteService.update(lote.id, lote);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/lotes'),
        error: (errorResponse) => {
          console.log('Erro ao gravar: ' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse);
        }
      });
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400 && httpError.error?.errors) {
      httpError.error.errors.forEach((validationError: any) => {
        const formControl = this.formGroup.get(validationError.fieldName);
        if (formControl) {
          formControl.setErrors({ apiError: validationError.message });
        }
      });
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'Campo inválido';
    }
    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessages: { [controlName: string]: any } = {
    idProcessador: {
      required: 'O processador deve ser selecionado.',
      apiError: ' '
    },
    data: {
      required: 'A data deve ser informada.',
      apiError: ' '
    },
    codigo: {
      required: 'O código deve ser informado.',
      maxlength: 'O código deve ter no máximo 50 caracteres.',
      apiError: ' '
    },
    estoque: {
      required: 'O estoque deve ser informado.',
      apiError: ' '
    },
    idFornecedor: {
      required: 'O fornecedor deve ser selecionado.',
      apiError: ' '
    }
  };
}

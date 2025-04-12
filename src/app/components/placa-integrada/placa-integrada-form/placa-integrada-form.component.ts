import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PlacaIntegradaService } from '../../../services/placa-integrada.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PlacaIntegrada } from '../../../models/placa-integrada.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-placa-integrada-form',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink, NgIf, ReactiveFormsModule, MatFormFieldModule, 
            MatInputModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './placa-integrada-form.component.html',
  styleUrl: './placa-integrada-form.component.css'
})
export class PlacaIntegradaFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private placaIntegradaService: PlacaIntegradaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const placaIntegrada: PlacaIntegrada = this.activatedRoute.snapshot.data['placaIntegrada'];

    this.formGroup = this.formBuilder.group({
      id: [(placaIntegrada && placaIntegrada.id) ? placaIntegrada.id : null],
      nome: [(placaIntegrada && placaIntegrada.nome) ? placaIntegrada.nome : '', 
              Validators.compose([Validators.required, Validators.maxLength(100)])],
      openGl: [(placaIntegrada && placaIntegrada.openGl) ? placaIntegrada.openGl : '', 
              Validators.compose([Validators.required, Validators.maxLength(20)])],
      vulkan: [(placaIntegrada && placaIntegrada.vulkan) ? placaIntegrada.vulkan : '', 
              Validators.compose([Validators.required, Validators.maxLength(20)])],
      directX: [(placaIntegrada && placaIntegrada.directX) ? placaIntegrada.directX : '', 
              Validators.compose([Validators.required, Validators.maxLength(20)])]
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const placaIntegrada = this.formGroup.value;
      console.log(placaIntegrada)

      const operacao = placaIntegrada.id == null
        ? this.placaIntegradaService.insert(placaIntegrada)
        : this.placaIntegradaService.update(placaIntegrada.id, placaIntegrada);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/placasintegradas');
        },
        error: (errorResponse) => {
          console.log('Erro ao gravar: ' + JSON.stringify(errorResponse));
          this.tratarErros(errorResponse);
        }
      });
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if(httpError.error?.errors){
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({apiError: validationError.message});
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }
  }

  excluir() {
    const placaIntegrada = this.formGroup.value;
    if (placaIntegrada.id != null) {
      this.placaIntegradaService.delete(placaIntegrada.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/placasintegradas');
        },
        error: (errorResponse) => {
          console.log('Erro ao excluir: ' + JSON.stringify(errorResponse));
          alert('Erro ao excluir a placa integrada');
        }
      });
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

  errorMessages: {[controlName: string]: {[errorName: string]: string}} = {
    nome: {
      required: 'O nome deve ser informado.',
      maxlength: 'O nome deve ter no máximo 100 caracteres.',
      apiError: ' '
    },
    openGl: {
      required: 'A versão do OpenGL deve ser informada.',
      maxlength: 'A versão do OpenGL deve ter no máximo 20 caracteres.',
      apiError: ' '
    },
    vulkan: {
      required: 'A versão do Vulkan deve ser informada.',
      maxlength: 'A versão do Vulkan deve ter no máximo 20 caracteres.',
      apiError: ' '
    },
    directX: {
      required: 'A versão do DirectX deve ser informada.',
      maxlength: 'A versão do DirectX deve ter no máximo 20 caracteres.',
      apiError: ' '
    }
  };
}
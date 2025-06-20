import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProcessadorService } from '../../../services/processador.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Processador, MemoriaCache, Frequencia, ConsumoEnergetico, Conectividade } from '../../../models/processador.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PlacaIntegradaService } from '../../../services/placa-integrada.service';
import { PlacaIntegrada } from '../../../models/placa-integrada.model';

@Component({
  selector: 'app-processador-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIf, ReactiveFormsModule, MatFormFieldModule, 
            MatInputModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule,
            MatSelectModule, MatCheckboxModule],
  templateUrl: './processador-form.component.html',
  styleUrl: './processador-form.component.css'
})
export class ProcessadorFormComponent {
  formGroup: FormGroup;
  placasIntegradas: PlacaIntegrada[] = [];
  fabricantes = [
    { id: 1, nome: 'Intel' },
    { id: 2, nome: 'AMD' }
  ];
  imagemFiles: File[] = [];
  imagemUrls: (string | ArrayBuffer | null)[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public processadorService: ProcessadorService,
    private placaIntegradaService: PlacaIntegradaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const processador: Processador = this.activatedRoute.snapshot.data['processador'];

    this.formGroup = this.formBuilder.group({
      id: [(processador && processador.id) ? processador.id : null],
      nome: [(processador && processador.nome) ? processador.nome : '', 
              Validators.compose([Validators.required, Validators.maxLength(100)])],
      socket: [(processador && processador.socket) ? processador.socket : '', 
              Validators.compose([Validators.required, Validators.maxLength(50)])],
      threads: [(processador && processador.threads) ? processador.threads : '', 
              Validators.compose([Validators.required, Validators.min(1)])],
      nucleos: [(processador && processador.nucleos) ? processador.nucleos : '', 
              Validators.compose([Validators.required, Validators.min(1)])],
      desbloqueado: [(processador && processador.desbloqueado) ? processador.desbloqueado : false],
      preco: [(processador && processador.preco) ? processador.preco : '', 
              Validators.compose([Validators.required, Validators.min(0)])],
      desconto: [(processador && processador.desconto) ? processador.desconto : 0, 
              Validators.compose([Validators.min(0), Validators.max(100)])],
      fabricante: [(processador && processador.fabricante) ? processador.fabricante : '', Validators.required],
      placaIntegrada: [(processador && processador.placaIntegrada) ? processador.placaIntegrada : null],

      memoriaCache: this.formBuilder.group({
        cacheL2: [(processador && processador.memoriaCache && processador.memoriaCache.cacheL2) ? processador.memoriaCache.cacheL2 : '', 
          Validators.compose([Validators.min(0)])],
        cacheL3: [(processador && processador.memoriaCache && processador.memoriaCache.cacheL3) ? processador.memoriaCache.cacheL3 : '', 
          Validators.compose([Validators.min(0)])]
      }),

      frequencia: this.formBuilder.group({
        clockBasico: [(processador && processador.frequencia && processador.frequencia.clockBasico) ? processador.frequencia.clockBasico : '', 
          Validators.compose([Validators.required, Validators.min(0)])],
        clockBoost: [(processador && processador.frequencia && processador.frequencia.clockBoost) ? processador.frequencia.clockBoost : '']
      }),

      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [(processador && processador.consumoEnergetico && processador.consumoEnergetico.energiaBasica) ? processador.consumoEnergetico.energiaBasica : '', 
          Validators.compose([Validators.min(0)])],
        energiaMaxima: [(processador && processador.consumoEnergetico && processador.consumoEnergetico.energiaMaxima) ? processador.consumoEnergetico.energiaMaxima : '', 
          Validators.compose([Validators.required, Validators.min(0)])]
      }),

      conectividade: this.formBuilder.group({
        pci: [(processador && processador.conectividade && processador.conectividade.pci) ? processador.conectividade.pci : '', Validators.required],
        tipoMemoria: [(processador && processador.conectividade && processador.conectividade.tipoMemoria) ? processador.conectividade.tipoMemoria : '', Validators.required],
        canaisMemoria: [(processador && processador.conectividade && processador.conectividade.canaisMemoria) ? processador.conectividade.canaisMemoria : '', Validators.compose([Validators.required, Validators.min(1)])]
      }),

      imagens: [[]]
    });


    this.carregarPlacasIntegradas();

    
  }


  carregarPlacasIntegradas() {
    this.placaIntegradaService.findAll().subscribe({
      next: (placas) => {
        this.placasIntegradas = placas;
      },
      error: (error) => {
        console.error('Erro ao carregar placas integradas:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.imagemFiles = [];
    this.imagemUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imagemFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async salvar() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      // Garante que só o ID (ou null) vai para o backend
      const formValue = this.formGroup.value;
      const processador = {
        ...formValue,
        fabricante: formValue.fabricante, // já é o id
        placaIntegrada: formValue.placaIntegrada ? formValue.placaIntegrada : null // só id ou null
      };

      const operacao = processador.id == null
        ? this.processadorService.insert(processador)
        : this.processadorService.update(processador.id, processador);

      operacao.subscribe({
        next: async (createdProcessador: any) => {
          const processadorId = createdProcessador.id || processador.id;
          if (this.imagemFiles && this.imagemFiles.length > 0 && processadorId) {
            for (const file of this.imagemFiles) {
              await this.processadorService.uploadImagem(file, processadorId).toPromise();
            }
          }
          this.router.navigateByUrl('/admin/processadores');
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
          // Tratando campos aninhados como memoriaCache.l1
          const fieldPathParts = validationError.fieldName.split('.');
          
          if (fieldPathParts.length > 1) {
            // Campo aninhado
            const parentGroup = this.formGroup.get(fieldPathParts[0]) as FormGroup;
            if (parentGroup) {
              const childControl = parentGroup.get(fieldPathParts[1]);
              if (childControl) {
                childControl.setErrors({apiError: validationError.message});
              }
            }
          } else {
            // Campo raiz
            const formControl = this.formGroup.get(validationError.fieldName);
            if (formControl) {
              formControl.setErrors({apiError: validationError.message});
            }
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }
  }

  excluir() {
    const processador = this.formGroup.value;
    if (processador.id != null) {
      this.processadorService.delete(processador.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/processadores');
        },
        error: (errorResponse) => {
          console.log('Erro ao excluir: ' + JSON.stringify(errorResponse));
          alert('Erro ao excluir o processador');
        }
      });
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    // Tratar caminhos aninhados como 'memoriaCache.l1'
    const parts = controlName.split('.');
    
    if (parts.length > 1) {
      // É um controle aninhado
      const errorObj = this.errorMessages[parts[0]]?.[parts[1]];
      if (!errors || !errorObj) {
        return 'Campo inválido';
      }
      
      for (const errorName in errors) {
        if (errorObj[errorName]) {
          return errorObj[errorName];
        }
      }
    } else {
      // É um controle raiz
      if (!errors || !this.errorMessages[controlName]) {
        return 'Campo inválido';
      }
      
      for (const errorName in errors) {
        if (this.errorMessages[controlName][errorName]) {
          return this.errorMessages[controlName][errorName];
        }
      }
    }
    
    return 'Campo inválido';
  }

  errorMessages: {[controlName: string]: any} = {
    nome: {
      required: 'O nome deve ser informado.',
      maxlength: 'O nome deve ter no máximo 100 caracteres.',
      apiError: ' '
    },
    socket: {
      required: 'O socket deve ser informado.',
      maxlength: 'O socket deve ter no máximo 50 caracteres.',
      apiError: ' '
    },
    threads: {
      required: 'O número de threads deve ser informado.',
      min: 'O número de threads deve ser pelo menos 1.',
      apiError: ' '
    },
    nucleos: {
      required: 'O número de núcleos deve ser informado.',
      min: 'O número de núcleos deve ser pelo menos 1.',
      apiError: ' '
    },
    preco: {
      required: 'O preço deve ser informado.',
      min: 'O preço deve ser maior ou igual a zero.',
      apiError: ' '
    },
    fabricante: {
      required: 'O fabricante deve ser selecionado.',
      apiError: ' '
    },
    placaIntegrada: {
      apiError: ' '
    },
    memoriaCache: {
      l1: {
        min: 'A memória cache L1 deve ser maior ou igual a zero.',
        apiError: ' '
      },
      l2: {
        min: 'A memória cache L2 deve ser maior ou igual a zero.',
        apiError: ' '
      },
      l3: {
        min: 'A memória cache L3 deve ser maior ou igual a zero.',
        apiError: ' '
      }
    },
    frequencia: {
      clockBasico: {
        required: 'A frequência base deve ser informada.',
        min: 'A frequência base deve ser maior que zero.',
        apiError: ' '
      },
      clockMaximo: {
        min: 'A frequência turbo deve ser maior que zero.',
        apiError: ' '
      }
    },
    consumoEnergetico: {
      tdp: {
        required: 'O TDP deve ser informado.',
        min: 'O TDP deve ser maior ou igual a zero.',
        apiError: ' '
      },
      tecnologia: {
        required: 'A tecnologia deve ser informada.',
        apiError: ' '
      }
    },
    conectividade: {
      pciExpress: {
        required: 'A versão do PCI Express deve ser informada.',
        apiError: ' '
      }
    }
  };



}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EnderecoService } from '../../../services/endereco.service';
import { CidadeService } from '../../../services/cidade.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Cidade } from '../../../models/cidade.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-adicionar-endereco',
  standalone: true,
  templateUrl: './adicionar-endereco.component.html',
  styleUrls: ['./adicionar-endereco.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
  ]
})
export class AdicionarEnderecoComponent {
  formGroup: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private enderecoService: EnderecoService,
    private cidadeService: CidadeService,
    private router: Router,
    private estadoService: EstadoService
  ) {
    this.formGroup = this.formBuilder.group({
      logradouro: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      bairro: ['', Validators.required],
      complemento: [''],
      numero: ['', Validators.required],
      idCidade: [null, Validators.required]
    });

    this.carregarCidades();
  }

  carregarCidades(): void {
    this.cidadeService.findAll().subscribe({
      next: (cidades) => {
        this.cidades = [];
    
        cidades.forEach(cidade => {
          let nomeEstado = 'N/A';
    
          const estadoId = typeof cidade.estado === 'number'
            ? cidade.estado
            : cidade.estado?.id;
    
          if (estadoId != null) {
            this.estadoService.findById(String(estadoId)).subscribe(estado => {
              nomeEstado = estado?.nome || 'N/A';
              this.cidades.push({ ...cidade, nomeEstado });
            });
          } else {
            this.cidades.push({ ...cidade, nomeEstado });
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar cidades:', error);
      }
    });
    
  }

  salvar(): void {
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      this.enderecoService.insert(endereco).subscribe({
        next: () => this.router.navigateByUrl('/minha-conta'),
        error: (err) => console.error('Erro ao salvar endereço:', err)
      });
    }
  }
}

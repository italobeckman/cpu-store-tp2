import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CidadeService } from '../../../services/cidade.service';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Cidade } from '../../../models/cidade.model';
import { Estado } from '../../../models/estado.model';

@Component({
  selector: 'app-cidade-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css',
})
export class CidadeFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const cidade: Cidade = this.activatedRoute.snapshot.data['cidade'];

    this.formGroup = this.formBuilder.group({
      id: [cidade && cidade.id ? cidade.id : null],
      nome: [cidade && cidade.nome ? cidade.nome : '', Validators.required],
      estado: [
        cidade && cidade.estado ? cidade.estado : '',
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    this.carregarEstados();
  }

  carregarEstados(): void {
    this.estadoService.findAll().subscribe({
      next: (data) => {
        this.estados = data;
      },
      error: (error) => {
        console.error('Erro ao carregar estados:', error);
      },
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const cidade = this.formGroup.value;
      if (cidade.id == null) {
        this.cidadeService.create(cidade).subscribe({
          next: () => {
            this.router.navigateByUrl('/cidades');
          },
          error: (errorResponse) => {
            console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          },
        });
      } else {
        this.cidadeService.update(cidade.id, cidade).subscribe({
          next: () => {
            this.router.navigateByUrl('/cidades');
          },
          error: (errorResponse) => {
            console.log('Erro ao gravar' + JSON.stringify(errorResponse));
          },
        });
      }
    }
  }

  excluir() {
    const cidade = this.formGroup.value;
    if (cidade.id != null) {
      this.cidadeService.delete(cidade.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/cidades');
        },
        error: (errorResponse) => {
          console.log('Erro ao excluir' + JSON.stringify(errorResponse));
        },
      });
    }
  }
}

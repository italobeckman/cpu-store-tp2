import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnderecoService } from '../../../services/endereco.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Endereco } from '../../../models/endereco.model';
import { CidadeService } from '../../../services/cidade.service';
import { Cidade } from '../../../models/cidade.model';

@Component({
  selector: 'app-endereco-form',
  standalone: true,
  imports: [
    RouterLink, 
    NgIf, 
    NgFor,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './endereco-form.component.html',
  styleUrls: ['./endereco-form.component.css']
})
export class EnderecoFormComponent {
  formGroup: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private enderecoService: EnderecoService,
    private cidadeService: CidadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const endereco: Endereco = this.activatedRoute.snapshot.data['endereco'];

    this.formGroup = this.formBuilder.group({
      id: [endereco?.id || null],
      logradouro: [endereco?.logradouro || '', Validators.required],
      cep: [endereco?.cep || '', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      bairro: [endereco?.bairro || '', Validators.required],
      complemento: [endereco?.complemento || ''],
      numero: [endereco?.numero || '', Validators.required],
      idCidade: [endereco?.idCidade || null, Validators.required]
    });

    this.carregarCidades();
  }

  carregarCidades(): void {
    this.cidadeService.findAll().subscribe({
        next: (cidades) => {
            this.cidades = cidades.map(cidade => {
                const nomeEstado = this.getEstadoNome(cidade.estado);
                return { ...cidade, nomeEstado };
            });
            console.log('Cidades carregadas:', this.cidades);
        },
        error: (error) => {
            console.error('Erro ao carregar cidades:', error);
        }
    });
  }

  private getEstadoNome(estado: any): string {
    if (estado && typeof estado.subscribe === 'function') {
        let nome = 'N/A';
        estado.subscribe((e: any) => nome = e?.nome || 'N/A');
        return nome;
    }
    return estado?.nome || 'N/A';
  }

  salvar(): void {
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      
      if (endereco.id == null) {
        this.enderecoService.insert(endereco).subscribe({
          next: () => this.router.navigateByUrl('/admin/enderecos'),
          error: (err) => console.error('Erro ao criar endereço:', err)
        });
      } else {
        this.enderecoService.update(endereco).subscribe({
          next: () => this.router.navigateByUrl('/admin/enderecos'),
          error: (err) => console.error('Erro ao atualizar endereço:', err)
        });
      }
    }
  }

  excluir(): void {
    const endereco = this.formGroup.value;
    if (endereco.id != null) {
      this.enderecoService.delete(endereco.id).subscribe({
        next: () => this.router.navigateByUrl('/admin/enderecos'),
        error: (err) => console.error('Erro ao excluir endereço:', err)
      });
    }
  }
}
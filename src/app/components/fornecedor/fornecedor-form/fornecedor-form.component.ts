import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [
    RouterLink, 
    NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatCardModule
  ],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [fornecedor?.id || null],
      nome: [fornecedor?.nome || '', Validators.required],
      email: [fornecedor?.email || '', [Validators.required, Validators.email]],
      telefone: [fornecedor?.telefone || '', Validators.required]
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      
      const operation = fornecedor.id 
        ? this.fornecedorService.update(fornecedor)
        : this.fornecedorService.insert(fornecedor);

      operation.subscribe({
        next: () => this.navigateBack(),
        error: (error: any) => console.error('Erro ao salvar:', error)
      });
    }
  }

  excluir() {
    const fornecedor = this.formGroup.value;
    if (fornecedor.id) {
      this.fornecedorService.delete(fornecedor).subscribe({
        next: () => this.navigateBack(),
        error: (error: any) => console.error('Erro ao excluir:', error)
      });
    }
  }

  private navigateBack() {
    this.router.navigate(['/admin/fornecedores']);
  }
}
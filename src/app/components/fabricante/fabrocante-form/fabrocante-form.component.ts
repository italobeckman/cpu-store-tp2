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
import { FabricanteService } from '../../../services/fabricante.service';
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteParaRetorno } from '../../../models/fabricante_para_retorno';
import { TelefoneService } from '../../../services/telefone.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorParaInserir } from '../../../models/fornecedor_para_inserir';
import { FabricanteParaListagem } from '../../../models/fabricante_para_listagem';

@Component({
  selector: 'app-fabrocante-form',
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
  templateUrl: './fabrocante-form.component.html',
  styleUrls: ['./fabrocante-form.component.css']
})
export class FabrocanteFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fabricanteService: FabricanteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const fabricanteRecebido: FabricanteParaListagem = this.activatedRoute.snapshot.data['fabricante'];
    const fabricante: FabricanteParaRetorno = {
      id: fabricanteRecebido.id,
      nome: fabricanteRecebido.nome,
      email: fabricanteRecebido.email,
      telefone: TelefoneService.converteTelefoneToString(fabricanteRecebido.telefone)
    }
    console.log(fabricante)

    this.formGroup = this.formBuilder.group({
      id: [fabricante?.id || null],
      nome: [fabricante?.nome || '', Validators.required],
      email: [fabricante?.email || '', [Validators.required, Validators.email]],
      telefone: [fabricante?.telefone || '', Validators.required]
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const fabricante = this.formGroup.value;
      
      const operation = fabricante.id 
        ? this.fabricanteService.update(fabricante)
        : this.fabricanteService.insert(fabricante);

      operation.subscribe({
        next: () => this.navigateBack(),
        error: (error: any) => console.error('Erro ao salvar:', error)
      });
    }
  }

  excluir() {
    const fabricante = this.formGroup.value;
    if (fabricante.id) {
      this.fabricanteService.delete(fabricante).subscribe({
        next: () => this.navigateBack(),
        error: (error: any) => console.error('Erro ao excluir:', error)
      });
    }
  }

  private navigateBack() {
    this.router.navigate(['/admin/fabricantes']);
  }
}

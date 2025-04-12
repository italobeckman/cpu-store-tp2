import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cargos-dialog',
  templateUrl: './cargos-dialog.component.html',
  styleUrl: './cargos-dialog.component.css',
  imports: [MatDialogActions, MatDialogContent, MatCard, MatCardContent, NgIf, NgFor, RouterLink],
})
export class CargosDialogComponent {
  [x: string]: any;
  constructor(
    public dialogRef: MatDialogRef<CargosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {usuario: any} 
  ) {
  }

  public fecharDialogENavegar() {
    this.dialogRef.close();
    this['router'].navigate(['/admin/usuarios']);
  }

  
  buscarDadosViaCpf(cpf: string){
    
  }
}

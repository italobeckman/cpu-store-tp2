import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ConfirmDialogComponent } from '../../estado/popup-confirmar-delecao/popup-confirmar-delecao.component';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { CargosDialogComponent } from './cargos-dialog/cargos-dialog.component';
import { PaginatorIntlService } from '../../../services/paginator-intl.service';

@Component({
  selector: 'app-usuario-list',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    RouterLink,
    MatListModule,
  ],providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  tableColumns: string[] = ['id-column', 'nome-column', 'cpf-column', 'email-column', 'login-column', 'telefones-column', 'perfil-column', 'acoes-column'];
  usuarios: Usuario[] = [];

  totalRegistros = 0;
  pageSize = 2;
  pagina = 0;
  filtro: string = "";

  constructor(
    private usuarioService: UsuarioService, 
    private dialog: MatDialog, 
    private funcionarioService: FuncionariosService,
  ) {}
  
  ngOnInit(): void {
    this.carregarUsuarios();
    this.carregarTotalRegistros();
  }

  carregarUsuarios() {

    this.usuarioService.findAll(this.pagina, this.pageSize).subscribe(data => {
      this.usuarios = data;

      this.usuarios.forEach(usuario => {
        this.funcionarioService.findByUserName(usuario.username).subscribe(funcionario => {
          if(funcionario != null && funcionario != undefined){
            usuario.funcionario = funcionario
            usuario.isFuncionario = true
          }
        })
      });

    });

    console.log(this.usuarios)
  }


  carregarTotalRegistros() {
    this.usuarioService.count().subscribe(data => {
      console.log(data);
      this.totalRegistros = data;
    });
  }



  excluir(usuario: Usuario) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        if (usuario.id != null) {

          this.usuarioService.delete(usuario).subscribe({
            next: (usuarioCadastrado) => {
              this.ngOnInit();
            },
            error: (err) => {
              console.log('Erro ao excluir' + JSON.stringify(err));
            }
          })
        }
      }
    })
  }

  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.pagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarUsuarios();
  }

  /*
  aplicarFiltro() {
    this.carregarUsuarios();
    this.carregarTotalRegistros();
  }*/

  verDetalhes(usuarioData: any): void {
    const usuario = usuarioData;
  
    this.dialog.open(CargosDialogComponent, {
      width: '700px',
      data: { usuario }
    });
  }
  
  isEven(id: number): boolean {
    // console.log(id % 2 === 0) 
    return id % 2 === 0;
  }
}

import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PaginatorIntlService } from '../../../services/paginator-intl.service';
import { ConfirmDialogComponent } from '../../estado/popup-confirmar-delecao/popup-confirmar-delecao.component';
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fabricante-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './fabrocante-list.component.html',
  styleUrls: ['./fabrocante-list.component.css']
})
export class FabricanteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'acao'];
  fabricantes: Fabricante[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  isLoading: boolean | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private fabricanteService: FabricanteService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private paginatorIntl: PaginatorIntlService,
  ) {


  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.fabricanteService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        // Atribuindo os dados recebidos ao array fabricantes
        this.fabricantes = data || []; // Usando um array vazio caso 'data' seja undefined ou null
        this.isLoading = false;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao carregar fabricantes:', error);
        this.isLoading = false;
        this.cdRef.markForCheck();
      }
    });
  
    this.fabricanteService.count().subscribe({
      next: (total) => {''
        this.totalRecords = total;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao contar fabricantes:', error);
        this.cdRef.markForCheck();
      }
    });
  }
  

  excluir(fabricante: Fabricante): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fabricanteService.delete(fabricante).subscribe({
          next: () => this.loadData(),
          error: (error) => console.error('Erro ao excluir:', error)
        });
      }
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();

    if (this.paginator) {
      this.paginator.pageIndex = this.page;
      this.paginator._changePageSize(this.pageSize);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator._intl = this.paginatorIntl;
      this.paginatorIntl.changes.next();
      this.cdRef.markForCheck();
    }
  }
}

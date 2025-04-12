import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { PaginatorIntlService } from '../../../services/paginator-intl.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { ConfirmDialogComponent } from '../../estado/popup-confirmar-delecao/popup-confirmar-delecao.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

@Component({
  selector: 'app-estado-list',
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
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'acao'];
  estados: Fornecedor[] = [];
  totalRecords = 0;
  pageSize = 2;
  page = 0;
  isLoading = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 

  constructor(
    private fornecedorService: FornecedorService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private paginatorIntl: PaginatorIntlService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.estados = [...data]; // Nova referência para triggerar o OnPush
        this.isLoading = false;
        this.cdRef.markForCheck(); // Marca para verificação no próximo ciclo
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
        this.cdRef.markForCheck();
      }
    });
  
    this.fornecedorService.count().subscribe({
      next: (total) => {
        this.totalRecords = total;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error counting records:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  excluir(element: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fornecedorService.delete(element).subscribe({
          next: () => {
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting:', error);
          }
        });
      }
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
    
    // Atualiza o paginador manualmente
    if (this.paginator) {
      this.paginator.pageIndex = this.page;
      this.paginator._changePageSize(this.pageSize); // Força a atualização interna
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl = this.paginatorIntl; // Associa o serviço de tradução ao paginator
      this.paginatorIntl.changes.next(); // Notifica mudanças para atualizar as traduções
      this.cdRef.markForCheck();
    }
  }
}
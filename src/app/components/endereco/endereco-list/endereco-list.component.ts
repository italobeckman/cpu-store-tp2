import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Endereco } from '../../../models/endereco.model';
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
import { PaginatorIntlService } from '../../../services/paginator-intl.service';
import { EnderecoService } from '../../../services/endereco.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { ConfirmDialogComponent } from '../../estado/popup-confirmar-delecao/popup-confirmar-delecao.component';

@Component({
  selector: 'app-endereco-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './endereco-list.component.html',
  styleUrls: ['./endereco-list.component.css']
})
export class EnderecoListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'logradouro', 'cep', 'bairro', 'numero', 'cidade', 'acao'];
  enderecos: Endereco[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  isLoading = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private enderecoService: EnderecoService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private paginatorIntl: PaginatorIntlService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.enderecoService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.enderecos = [...data];
        this.isLoading = false;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error loading enderecos:', error);
        this.isLoading = false;
        this.cdRef.markForCheck();
      }
    });
  
    this.enderecoService.count().subscribe({
      next: (total) => {
        this.totalRecords = total;
        this.cdRef.markForCheck();
      },
      error: (error) => {
        console.error('Error counting enderecos:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  excluir(element: Endereco): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Tem certeza que deseja excluir o endereço ${element.logradouro}, ${element.numero}?` }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.enderecoService.delete(element.id).subscribe({
          next: () => {
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting endereco:', error);
          }
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

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator._intl = this.paginatorIntl;
      this.paginatorIntl.changes.next();
      this.cdRef.markForCheck();
    }
  }
}
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { EstadoService } from '../../../services/estado.service';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../estado/popup-confirmar-delecao/popup-confirmar-delecao.component';
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
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cidade-list',
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
    MatFormFieldModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './cidade-list.component.html',
  styleUrls: ['./cidade-list.component.css']
})
export class CidadeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acao'];
  cidades: Cidade[] = [];
  totalRecords = 0;
  pageSize = 2;
  page = 0;
  isLoading = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 

  constructor(
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private paginatorIntl: PaginatorIntlService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cidadeService.findAll().subscribe({
      next: (data) => {
        // Create a map to store all estado ids we need to fetch
        const estadoIds = new Set<number>();
        data.forEach(cidade => {
          if (cidade.estado) {
            estadoIds.add(cidade.estado);
          }
        });
  
        // If we have estados to fetch
        if (estadoIds.size > 0) {
          // Create a map to store estado id -> nome
          const estadoMap = new Map<number, string>();
          
          // Use forkJoin to fetch all estados in parallel
          import('rxjs').then(({ forkJoin, of }) => {
            const requests = Array.from(estadoIds).map(id => 
              this.estadoService.findById(id.toString()).pipe(
                catchError(error => {
                  console.error(`Error fetching estado ${id}:`, error);
                  return of(null);
                })
              )
            );
            
            forkJoin(requests).subscribe(estados => {
              // Create map of estado id -> nome
              estados.forEach(estado => {
                if (estado) {
                  // Garantir que o ID seja convertido para o tipo correto para o Map
                  console.log('Estado carregado:', estado);
                  estadoMap.set(Number(estado.id), estado.nome);
                }
              });
              
              // Set the nomeEstado for each cidade
              this.cidades = data.map(cidade => {
                const estadoNome = estadoMap.get(Number(cidade.estado));
                console.log(`Cidade ID ${cidade.id}, Estado ID ${cidade.estado}, Nome Estado: ${estadoNome || 'Não encontrado'}`);
                return {
                  ...cidade,
                  nomeEstado: estadoNome || 'N/A'
                };
              });
              
              this.isLoading = false;
              this.cdRef.markForCheck();
            });
          }).catch(error => {
            console.error('Error importing rxjs:', error);
            this.isLoading = false;
            this.cdRef.markForCheck();
          });
        } else {
          // If no estados to fetch
          this.cidades = [...data];
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
        this.cdRef.markForCheck();
      }
    });
  
    this.cidadeService.count().subscribe({
      next: (total: number): void => {
        this.totalRecords = total;
        this.cdRef.markForCheck();
      },
      error: (error: Error): void => {
        console.error('Error counting records:', error);
        this.cdRef.markForCheck();
      }
    });
  }

  excluir(element: Cidade): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cidadeService.delete(element.id).subscribe({
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
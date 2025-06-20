import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LoteService } from '../../../services/lote.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatButtonModule } from '@angular/material/button';

interface FornecedorResponse {
  id: number;
  nome: string;
  // outros campos se necessário
}

interface ProcessadorResponse {
  id: number;
  nome: string;
  // outros campos se necessário
}

interface LoteResponse {
  id: number;
  fornecedor: FornecedorResponse;
  data: string;
  codigo: string;
  estoque: number;
  processador: ProcessadorResponse;
}

@Component({
  selector: 'app-lote-list',
  templateUrl: './lote-list.component.html',
  styleUrls: ['./lote-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatToolbar,
    MatPaginator,
    MatButtonModule
  ]
})
export class LoteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'fornecedor', 'data', 'codigo', 'estoque', 'processador', 'acao']; // ajuste conforme suas colunas
  lotes: LoteResponse[] = [];
  dataSource: any;
  pageSize = 4;
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private loteService: LoteService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loteService.findAll().subscribe(data => {
      this.lotes = data ?? [];
      this.dataSource = this.lotes;
      this.totalRecords = data.length;
    });
  }

  paginar(event: PageEvent): void {
    this.pageSize = event.pageSize;
    // Aqui você pode implementar paginação real se o backend suportar
  }

  excluir(lote: LoteResponse): void {
    if (confirm('Deseja realmente excluir este lote?')) {
      this.loteService.delete(lote.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}

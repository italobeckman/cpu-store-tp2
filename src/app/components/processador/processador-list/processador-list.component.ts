import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessadorService } from '../../../services/processador.service';
import { MatPaginatorModule, PageEvent, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Processador } from '../../../models/processador.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginatorIntlService } from '../../../services/paginator-intl.service';
import { MatFormField, MatLabel } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-processador-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, RouterLink, MatToolbarModule, 
    MatIconModule, MatButtonModule, MatTableModule
  ],providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './processador-list.component.html',
  styleUrl: './processador-list.component.css'
})
export class ProcessadorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'socket', 'threads', 'nucleos', 'desbloqueado', 'preço', 'acao'];
  processadors: Processador[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 2;
  page = 0;
  dataSource: any;
filtro: any;

  constructor(private processadorService: ProcessadorService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.processadorService.findAll(this.page, this.pageSize).subscribe(data => {
      this.processadors = data ?? []; // Se `data` for nulo ou undefined, atribui array vazio
    });
  
    this.processadorService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  excluir(processador: Processador): void {
    this.processadorService.delete(processador.id).subscribe(() => {
      this.loadData();
    });
  }
  
}
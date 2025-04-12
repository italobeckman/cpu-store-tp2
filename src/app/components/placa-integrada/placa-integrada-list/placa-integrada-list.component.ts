import { Component, OnInit, ViewChild } from '@angular/core';
import { PlacaIntegradaService } from '../../../services/placa-integrada.service';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { PlacaIntegrada } from '../../../models/placa-integrada.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placa-integrada-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './placa-integrada-list.component.html',
  styleUrl: './placa-integrada-list.component.css'
})
export class PlacaIntegradaListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'openGl', 'vulkan', 'directX', 'acao'];
  placaIntegradas: PlacaIntegrada[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 2;
  page = 0;

  constructor(private placaIntegradaService: PlacaIntegradaService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.placaIntegradaService.findAll(this.page, this.pageSize).subscribe(data => {
      this.placaIntegradas = data;
    });
    
    this.placaIntegradaService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  excluir(placaIntegrada: PlacaIntegrada): void {
    this.placaIntegradaService.delete(placaIntegrada.id).subscribe(() => {
      this.loadData();
    });
  }
}
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProcessadorService } from '../../services/processador.service';
import { PlacaIntegradaService } from '../../services/placa-integrada.service';
import { Processador } from '../../models/processador.model';
import { PlacaIntegrada } from '../../models/placa-integrada.model';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
@Component({
  selector: 'app-home',
  imports:[
    MatIcon,
    MatButtonModule,
    MatSpinner,
    MatIconModule,
    NgIf,
    NgFor,
    MatTableModule,
    MatCardActions,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  processadores: Processador[] = [];
  placasIntegradas: PlacaIntegrada[] = [];
  isLoading: boolean = true;

  constructor(
    private processadorService: ProcessadorService,
    private placaIntegradaService: PlacaIntegradaService
  ) {}

  ngOnInit(): void {
    this.loadProcessadores();
    this.loadPlacasIntegradas();
  }

  private loadProcessadores(): void {
    this.processadorService.findAll().subscribe({
      next: (data) => {
        this.processadores = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar processadores:', err);
        this.isLoading = false;
      }
    });
  }

  private loadPlacasIntegradas(): void {
    this.placaIntegradaService.findAll().subscribe({
      next: (data) => {
        this.placasIntegradas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar placas integradas:', err);
        this.isLoading = false;
      }
    });
  }
}
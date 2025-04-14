import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'toolbar-example',
  standalone: true, // Adicionado para suportar 'imports' diretamente no componente
  templateUrl: 'toolbar.component.html',
  styleUrl: 'toolbar.component.css',
  imports: [MatButtonModule, MatIconModule, CommonModule, MatFormFieldModule, MatToolbarModule, RouterOutlet],
})
export class ToolbarOverviewExample {
  toolbarColor: string = 'rgb(59, 59, 59)';
  corBotao: string = '';

  public mudarCorBotao() {
    this.corBotao = this.corBotao === '' ? 'red' : '';
  }
}

import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterOutlet } from '@angular/router';
import { ProcessadorListComponent } from '../../processador/processador-list/processador-list.component';

@Component({
  standalone: true,
  selector: 'app-admin-template',
  imports: [HeaderComponent, SidebarComponent, 
    FooterComponent, RouterOutlet],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {
  
}
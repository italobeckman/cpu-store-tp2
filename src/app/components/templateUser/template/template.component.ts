import { Component } from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../template/sidebar/sidebar.component";

@Component({
  selector: 'app-template',
  imports: [ToolbarComponent, FooterComponent, RouterOutlet, SidebarComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

}

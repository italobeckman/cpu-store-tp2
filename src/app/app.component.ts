import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
//import { ToolbarOverviewExample } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CPU STORE';
}
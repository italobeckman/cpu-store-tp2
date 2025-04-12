import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  imports : [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule

  ],
})
export class AdminHomeComponent {

  constructor(private router: Router) { }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
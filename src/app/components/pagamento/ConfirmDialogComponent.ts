import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIcon],
  template: `
    <h2 mat-dialog-title class="dialog-title">CONFIRMAR EXCLUSÃO</h2>
    <mat-dialog-content class="dialog-content">
      <div class="warning-container">
        <mat-icon class="warning-icon">warning</mat-icon>
        <p class="warning-message">Você tem certeza que deseja excluir este cartão?</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="cancel-btn">CANCELAR</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" class="confirm-btn">EXCLUIR</button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Estilo principal do diálogo */
    :host {
      display: block;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%);
      border: 2px solid #ff0000;
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
      overflow: hidden;
      max-width: 400px;
    }

    /* Título do diálogo */
    .dialog-title {
      background: linear-gradient(90deg, #1a0000 0%, #500000 100%);
      color: #ffffff;
      padding: 16px 24px;
      margin: 0;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
      border-bottom: 1px solid #ff0000;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dialog-title mat-icon {
      color: #ff0000;
    }

    /* Conteúdo do diálogo */
    .dialog-content {
      padding: 24px;
      color: #ffffff;
      font-family: 'Rajdhani', sans-serif;
      background: #0a0a0a;
    }

    .warning-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }

    .warning-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: #ff0000;
      filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.5));
    }

    .warning-message {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Ações do diálogo */
    .dialog-actions {
      background: linear-gradient(90deg, #1a0000 0%, #500000 100%);
      padding: 16px 24px;
      border-top: 1px solid #333;
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }

    .cancel-btn {
      color: #ccc !important;
      font-family: 'Orbitron', sans-serif;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%) !important;
      color: white !important;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 0 24px;
      border: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .confirm-btn::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to bottom right,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 55%
      );
      transform: rotate(30deg);
      transition: all 0.5s;
    }

    .confirm-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4) !important;
    }

    .confirm-btn:hover::after {
      left: 100%;
    }

    .confirm-btn:active {
      transform: translateY(1px);
    }

    /* Responsividade */
    @media (max-width: 600px) {
      :host {
        max-width: 95vw;
      }

      .dialog-title {
        font-size: 18px;
        padding: 14px 20px;
      }

      .dialog-content {
        padding: 20px;
      }

      .warning-icon {
        font-size: 50px;
        width: 50px;
        height: 50px;
      }

      .warning-message {
        font-size: 16px;
      }

      .dialog-actions {
        padding: 14px 20px;
        flex-direction: column;
        gap: 10px;
      }

      .cancel-btn,
      .confirm-btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
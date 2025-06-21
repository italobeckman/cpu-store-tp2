import { Component } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-confirmar-pagamento-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="icon-wrapper">
          <mat-icon class="payment-icon">credit_card</mat-icon>
        </div>
        <h2 class="dialog-title">Confirmar Pagamento</h2>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <div class="payment-info">
          <div class="payment-method">
            <mat-icon class="method-icon">credit_card</mat-icon>
            <span class="method-text">Cartão de Crédito</span>
          </div>
          
          <p class="confirmation-message">
            Confirmar esta transação?
          </p>
          
          <div class="security-info">
            <mat-icon class="security-icon">security</mat-icon>
            <span class="security-text">Transação 100% segura👍</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button 
          mat-button 
          class="cancel-button" 
          (click)="onCancel()"
        >
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        
        <button 
          mat-raised-button 
          class="confirm-button" 
          (click)="onConfirm()"
        >
          <mat-icon>check</mat-icon>
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .dialog-container {
      width: 300px;
      max-width: 90vw;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
      font-family: 'Roboto', sans-serif;
    }

    /* Header */
    .dialog-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 24px;
      text-align: center;
      position: relative;
    }

    .icon-wrapper {
      margin-bottom: 12px;
    }

    .payment-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    /* Content */
    .dialog-content {
      padding: 32px 24px;
    }

    .payment-info {
      text-align: center;
    }

    .payment-method {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #f5f5f5;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      border: 2px solid #e0e0e0;
    }

    .method-icon {
      color: #1976d2;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .method-text {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .confirmation-message {
      font-size: 16px;
      color: #666;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .security-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(76, 175, 80, 0.1);
      color: #2e7d32;
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .security-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .security-text {
      font-size: 14px;
      font-weight: 500;
    }

    /* Actions */
    .dialog-actions {
      padding: 0 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .cancel-button,
    .confirm-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      text-transform: none;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      min-width: 120px;
      justify-content: center;
    }

    .cancel-button {
      color: #d32f2f;
      border: 1px solid #d32f2f;
      background: transparent;
    }

    .cancel-button:hover {
      background: rgba(211, 47, 47, 0.08);
      transform: translateY(-1px);
    }

    .cancel-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .confirm-button {
      background: #4caf50;
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .confirm-button:hover {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }

    .confirm-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Focus states */
    .cancel-button:focus,
    .confirm-button:focus {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    /* Animation */
    @keyframes dialogEnter {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .dialog-container {
      animation: dialogEnter 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .dialog-container {
        width: 95vw;
        margin: 20px auto;
      }

      .dialog-header {
        padding: 20px;
      }

      .payment-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        padding: 10px;
      }

      .dialog-title {
        font-size: 20px;
      }

      .dialog-content {
        padding: 24px 20px;
      }

      .payment-method {
        flex-direction: column;
        gap: 8px;
        padding: 16px 12px;
      }

      .dialog-actions {
        padding: 0 20px 20px;
        flex-direction: column-reverse;
        gap: 8px;
      }

      .cancel-button,
      .confirm-button {
        width: 100%;
        min-width: auto;
      }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .dialog-container {
        background: #2d2d2d;
        color: #ffffff;
      }

      .payment-method {
        background: #3d3d3d;
        border-color: #555;
      }

      .method-text {
        color: #ffffff;
      }

      .confirmation-message {
        color: #cccccc;
      }
    }

    /* Material Dialog overrides */
    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
      border-radius: 16px !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    ::ng-deep .mat-mdc-dialog-surface {
      border-radius: 16px !important;
      box-shadow: none !important;
    }

    ::ng-deep .cdk-overlay-backdrop {
      background: rgba(0, 0, 0, 0.6) !important;
    }
  `,
  ],
})
export class ConfirmarPagamentoDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmarPagamentoDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true)
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }
}

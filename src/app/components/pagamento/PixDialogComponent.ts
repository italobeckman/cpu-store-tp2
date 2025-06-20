import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { CommonModule } from "@angular/common";
import * as QRCode from 'qrcode';

export interface PixData {
  payload: string;
  chave: string;
  valor: number;
  descricao?: string;
}

@Component({
  selector: "app-pix-dialog",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
  ],
  template: `
    <div class="pix-dialog">
      <h2 class="dialog-title">
        <mat-icon class="title-icon">payment</mat-icon>
        PAGAMENTO VIA PIX
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <!-- Valor em destaque -->
        <div class="valor-card">
          <div class="valor-section">
            <p class="valor-label">VALOR A PAGAR</p>
            <p class="valor-amount">{{ formatCurrency(data.valor) }}</p>
            <p *ngIf="data.descricao" class="valor-description">{{ data.descricao }}</p>
          </div>
        </div>

        <!-- QR Code Section -->
        <div class="qr-section">
          <div class="qr-header">
            <mat-icon class="qr-icon">qr_code</mat-icon>
            <span class="qr-title">ESCANEIE O QR CODE</span>
          </div>

          <div class="qr-container">
            <!-- Loading State -->
            <div *ngIf="qrCodeLoading" class="qr-loading">
              <mat-spinner diameter="50" class="custom-spinner"></mat-spinner>
              <p class="loading-text">GERANDO QR CODE...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="qrCodeError" class="qr-error">
              <mat-icon class="error-icon">error_outline</mat-icon>
              <p class="error-text">ERRO AO GERAR QR CODE</p>
              <button mat-button class="retry-button" (click)="generateQRCode()">
                <mat-icon>refresh</mat-icon>
                TENTAR NOVAMENTE
              </button>
            </div>

            <!-- QR Code Image -->
            <div *ngIf="!qrCodeLoading && !qrCodeError" class="qr-image-wrapper">
              <img 
                [src]="qrCodeUrl" 
                alt="QR Code PIX"
                class="qr-image"
                (load)="onQrCodeLoad()"
                (error)="onQrCodeError()"
              >
              <div class="qr-glow"></div>
            </div>
          </div>
        </div>

        <div class="divider-gamer"></div>

        <!-- Código PIX Section -->
        <div class="codigo-section">
          <div class="codigo-header">
            <span class="codigo-title">CÓDIGO PIX (COPIA E COLA)</span>
            <span class="codigo-badge">CÓDIGO GERADO</span>
          </div>

          <div class="codigo-container">
            <textarea 
              readonly 
              rows="4" 
              class="codigo-textarea"
              [value]="data.payload"
              #pixTextarea>
            </textarea>
            
            <button 
              mat-icon-button 
              class="copy-icon-btn"
              (click)="copiar()"
              [disabled]="!data.payload">
              <mat-icon [class.copied]="copiado">{{ copiado ? 'check' : 'content_copy' }}</mat-icon>
            </button>
          </div>

          <button 
            mat-raised-button
            class="copy-button"
            (click)="copiar()"
            [disabled]="!data.payload">
            <mat-icon>{{ copiado ? 'check' : 'content_copy' }}</mat-icon>
            {{ copiado ? 'COPIADO!' : 'COPIAR CÓDIGO PIX' }}
          </button>
        </div>

        <!-- Informações -->
        <div class="info-card">
          <div class="info-header">
            <mat-icon>info</mat-icon>
            <span>INFORMAÇÕES DO PAGAMENTO</span>
          </div>
          <div class="info-content">
            <div class="info-row">
              <span class="info-label">CHAVE PIX:</span>
              <span class="info-value">{{ data.chave }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">VALOR:</span>
              <span class="info-value">{{ formatCurrency(data.valor) }}</span>
            </div>
            <div class="info-row" *ngIf="data.descricao">
              <span class="info-label">DESCRIÇÃO:</span>
              <span class="info-value">{{ data.descricao }}</span>
            </div>
          </div>
        </div>

        <!-- Instruções -->
        <div class="instrucoes">
          <div class="instrucoes-header">
            <mat-icon>help_outline</mat-icon>
            <span>COMO PAGAR</span>
          </div>
          <div class="instrucoes-list">
            <div class="instrucao-item">
              <span class="step-number">1</span>
              <p>ABRA O APP DO SEU BANCO E ESCOLHA A OPÇÃO PIX</p>
            </div>
            <div class="instrucao-item">
              <span class="step-number">2</span>
              <p>ESCANEIE O QR CODE OU COLE O CÓDIGO PIX</p>
            </div>
            <div class="instrucao-item">
              <span class="step-number">3</span>
              <p>CONFIRME OS DADOS E FINALIZE O PAGAMENTO</p>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button class="close-button" (click)="fechar()">
          <mat-icon>close</mat-icon>
          FECHAR
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

    .pix-dialog {
      max-width: 450px;
      width: 100%;
      background-color: #0a0a0a;
      color: #ffffff;
      font-family: "Rajdhani", "Roboto Condensed", sans-serif;
      border: 2px solid #ff0000;
      position: relative;
      overflow: hidden;
      max-height: 90vh;
    }

    .pix-dialog::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #ff0000, transparent);
      z-index: 1;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 0;
      color: #ffffff;
      background: linear-gradient(90deg, #1a0000, #500000);
      padding: 20px 24px;
      font-family: "Rajdhani", sans-serif;
      font-weight: 700;
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
      position: relative;
      border-bottom: 1px solid #333;
      flex-shrink: 0;
    }

    .dialog-title::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 30%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.1));
    }

    .title-icon {
      color: #ff0000;
      font-size: 28px;
      filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.7));
    }

    .dialog-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background-color: #0a0a0a;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 140px);
    }

    /* Scrollbar personalizada */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #1a1a1a;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #ff0000;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #cc0000;
    }

    .valor-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2a0000 100%);
      border: 1px solid #333;
      border-left: 4px solid #ff0000;
      padding: 24px;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      min-height: 140px;
    }

    .valor-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.3;
    }

    .valor-section {
      text-align: center;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100px;
      padding: 8px 0;
    }

    .valor-label {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #999;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .valor-amount {
      margin: 0 0 12px 0;
      font-size: 42px;
      font-weight: 700;
      color: #ff0000;
      font-family: "Orbitron", monospace;
      text-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
      letter-spacing: 1px;
      line-height: 1.2;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .valor-description {
      margin: 0;
      font-size: 14px;
      color: #ccc;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.4;
    }

    .qr-section {
      text-align: center;
    }

    .qr-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 12px;
      background-color: #1a1a1a;
      border: 1px solid #333;
      border-left: 4px solid #ff0000;
      border-radius: 4px;
    }

    .qr-icon {
      font-size: 24px;
      color: #ff0000;
    }

    .qr-title {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ffffff;
    }

    .qr-container {
      position: relative;
      display: inline-block;
    }

    .qr-loading, .qr-error {
      width: 280px;
      height: 280px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      border: 2px solid #333;
      border-radius: 8px;
      position: relative;
    }

    .qr-loading::before, .qr-error::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 60%);
    }

    .custom-spinner {
      color: #ff0000 !important;
    }

    .loading-text, .error-text {
      margin-top: 16px;
      font-size: 14px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .retry-button {
      margin-top: 16px;
      background-color: #ff0000 !important;
      color: white !important;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .error-icon {
      font-size: 48px;
      color: #ff0000;
      margin-bottom: 8px;
    }

    .qr-image-wrapper {
      position: relative;
      display: inline-block;
    }

    .qr-image {
      border: 2px solid #333;
      border-radius: 8px;
      max-width: 280px;
      height: auto;
      position: relative;
      z-index: 2;
    }

    .qr-glow {
      background-color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .divider-gamer {
      height: 2px;
      background: linear-gradient(90deg, transparent, #ff0000, transparent);
      margin: 20px 0;
    }

    .codigo-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .codigo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background-color: #1a1a1a;
      border: 1px solid #333;
      border-left: 4px solid #ff0000;
      border-radius: 4px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .codigo-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ffffff;
    }

    .codigo-badge {
      background: linear-gradient(90deg, #ff0000, #cc0000);
      color: white;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
    }

    .codigo-container {
      position: relative;
    }

    .codigo-textarea {
      width: 100%;
      min-height: 120px;
      padding: 16px;
      padding-right: 56px;
      border: 2px solid #333;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      resize: none;
      background: #1a1a1a;
      color: #ffffff;
      transition: all 0.3s ease;
      overflow-x: hidden;
      overflow-y: auto;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .codigo-textarea:focus {
      border-color: #ff0000;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
      outline: none;
    }

    .codigo-textarea::-webkit-scrollbar {
      width: 6px;
    }

    .codigo-textarea::-webkit-scrollbar-track {
      background: #0a0a0a;
    }

    .codigo-textarea::-webkit-scrollbar-thumb {
      background: #ff0000;
      border-radius: 3px;
    }

    .copy-icon-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      background-color: #ff0000 !important;
      color: white !important;
      border: 2px solid #333;
      border-radius: 4px;
    }

    .copy-icon-btn:hover {
      background-color: #cc0000 !important;
      transform: scale(1.05);
    }

    .copy-icon-btn mat-icon.copied {
      color: #00ff00 !important;
    }

    .copy-button {
      width: 100%;
      height: 56px;
      background-color: #ff0000 !important;
      color: white !important;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .copy-button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: all 0.4s ease;
    }

    .copy-button:hover::before {
      left: 100%;
    }

    .copy-button:hover {
      background-color: #cc0000 !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
    }

    .info-card {
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      border: 1px solid #333;
      border-left: 4px solid #ff0000;
      overflow: hidden;
      border-radius: 8px;
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #2a0000;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 14px;
    }

    .info-header mat-icon {
      color: #ff0000;
    }

    .info-content {
      padding: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #333;
      gap: 12px;
    }

    .info-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .info-label {
      color: #999;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
      min-width: 80px;
    }

    .info-value {
      font-weight: 700;
      font-size: 14px;
      color: #ffffff;
      word-break: break-all;
      text-align: right;
      flex: 1;
      line-height: 1.4;
    }

    .instrucoes {
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      border: 1px solid #333;
      border-left: 4px solid #ff0000;
      border-radius: 8px;
    }

    .instrucoes-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #2a0000;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 14px;
    }

    .instrucoes-header mat-icon {
      color: #ff0000;
    }

    .instrucoes-list {
      padding: 16px;
    }

    .instrucao-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .instrucao-item:last-child {
      margin-bottom: 0;
    }

    .step-number {
      background-color: #ff0000;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }

    .instrucao-item p {
      margin: 0;
      font-size: 13px;
      color: #ccc;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .dialog-actions {
      padding: 20px 24px;
      background: linear-gradient(90deg, #1a0000, #500000);
      border-top: 1px solid #333;
      flex-shrink: 0;
    }

    .close-button {
      color: #999 !important;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .close-button:hover {
      color: #ff0000 !important;
      background-color: rgba(255, 0, 0, 0.1) !important;
    }

    /* Responsividade melhorada */
    @media (max-width: 768px) {
      .pix-dialog {
        max-width: 95vw;
        margin: 0;
        max-height: 95vh;
      }
      
      .qr-loading, .qr-error, .qr-image {
        max-width: 240px;
        height: auto;
      }
      
      .valor-amount {
        font-size: 32px;
      }

      .dialog-title {
        font-size: 20px;
        padding: 16px 20px;
      }

      .dialog-content {
        padding: 20px;
        max-height: calc(95vh - 120px);
      }

      .valor-card {
        padding: 20px;
        min-height: 120px;
      }

      .codigo-header {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }

      .info-row {
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
      }

      .info-label {
        min-width: auto;
      }

      .info-value {
        text-align: left;
      }
    }

    @media (max-width: 480px) {
      .qr-loading, .qr-error, .qr-image {
        max-width: 200px;
      }
      
      .valor-amount {
        font-size: 28px;
      }

      .dialog-title {
        font-size: 18px;
        letter-spacing: 1px;
      }

      .dialog-content {
        padding: 16px;
      }

      .valor-card {
        padding: 16px;
        min-height: 100px;
      }
    }

    /* Customização do Material Dialog */
    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
      border-radius: 12px !important;
      box-shadow: none !important;
      background: transparent !important;
      max-height: 95vh !important;
      overflow: hidden !important;
    }

    ::ng-deep .mat-mdc-dialog-surface {
      border-radius: 12px !important;
      box-shadow: none !important;
      max-height: 95vh !important;
      overflow: hidden !important;
    }

    ::ng-deep .cdk-overlay-backdrop {
      background: rgba(0, 0, 0, 0.8) !important;
    }

    /* Snackbar personalizado */
    ::ng-deep .success-snackbar {
      background-color: #4caf50 !important;
      color: white !important;
    }

    ::ng-deep .error-snackbar {
      background-color: #f44336 !important;
      color: white !important;
    }
  `]
})
export class PixDialogComponent implements OnInit {
  qrCodeUrl: string = '';
  qrCodeLoading = true;
  qrCodeError = false;
  copiado = false;
  data: PixData;

  constructor(
    public dialogRef: MatDialogRef<PixDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: PixData,
    private snackBar: MatSnackBar
  ) {
    this.data = dialogData;
  }

  ngOnInit(): void {
    this.generateQRCode();
  }

  async generateQRCode(): Promise<void> {
    try {
      this.qrCodeLoading = true;
      this.qrCodeError = false;
      
      // Gerar QR code como Data URL
      this.qrCodeUrl = await QRCode.toDataURL(this.data.payload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',  // Pontos escuros
          light: '#00000000' // Fundo transparente
        }
      });
      
      this.qrCodeLoading = false;
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      this.qrCodeLoading = false;
      this.qrCodeError = true;
    }
  }

  onQrCodeLoad(): void {
    this.qrCodeLoading = false;
    this.qrCodeError = false;
  }

  onQrCodeError(): void {
    this.qrCodeLoading = false;
    this.qrCodeError = true;
  }

  async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.data.payload);
      this.copiado = true;

      this.snackBar.open("CÓDIGO PIX COPIADO COM SUCESSO!", "FECHAR", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
        panelClass: ["success-snackbar"],
      });

      setTimeout(() => {
        this.copiado = false;
      }, 2000);
    } catch (error) {
      this.snackBar.open("ERRO AO COPIAR CÓDIGO. TENTE SELECIONAR E COPIAR MANUALMENTE.", "FECHAR", {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
        panelClass: ["error-snackbar"],
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
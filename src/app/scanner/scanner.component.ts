import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'io-scanner',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ZXingScannerModule],
  template: `
    <h1 mat-dialog-title> Conecta </h1>

    <div mat-dialog-content>
      <div class="scanner__container">
        <div class="video-skeleton">
          <h2> Cargando el escáner... </h2>
        </div>

        <zxing-scanner class="scanner"></zxing-scanner>
      </div>
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="closeScanner()"> Cerrar </button>
    </div>
  `,
  styles: [
    `
      .scanner__container {
        position: relative;

        .video-skeleton {
          align-items: center;
          background-color: gray;
          color: #ffffff;
          display: flex;
          justify-content: center;
          position: absolute;
        }

        .scanner {
          position: inherit;
          z-index: 1;
        }
      }
    `,
  ],
})
export class ScannerComponent {
  private dialogRef = inject(MatDialogRef<ScannerComponent>);

  closeScanner(): void {
    this.dialogRef.close();
  }
}

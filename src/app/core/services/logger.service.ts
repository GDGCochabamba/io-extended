import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private snackBar = inject(MatSnackBar);

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'cerrar', { panelClass: 'info-snackbar' });
  }

  handleError(message: string): void {
    this.snackBar.open(message, 'cerrar');
    console.error(message);
  }
}

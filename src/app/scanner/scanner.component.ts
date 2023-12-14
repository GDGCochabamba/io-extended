import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { finalize, of, Subject, switchMap } from 'rxjs';

import { AppUser } from '../core/models/app-user.model';
import { CurrentUserState } from '../core/states/current-user.state';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'io-scanner',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    ZXingScannerModule,
    NgIf,
  ],
  template: `
    <ng-container *ngIf="friend$ | async as friend" />
    <h1 mat-dialog-title> Conecta </h1>

    <div mat-dialog-content>
      <div class="scanner__container">
        <div class="video-skeleton">
          <h2> Cargando el escáner... </h2>
        </div>

        <zxing-scanner
          class="scanner"
          (scanSuccess)="processCode($event)"
        ></zxing-scanner>
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
      .error-message {
        color: red;
        margin-left: 20px;
      }
    `,
  ],
})
export class ScannerComponent {
  private userService = inject(UserService);
  private currentUser = inject(CurrentUserState).currentUser;
  private dialogRef = inject(MatDialogRef<ScannerComponent>);
  private snackBar = inject(MatSnackBar);
  statusMessage: string | null = null;

  subject$ = new Subject<string>();
  friend$ = this.subject$.pipe(
    switchMap((code) => this.userService.getUserData(code)),
    switchMap((friend) => {
      const currentUser = this.currentUser();
      if (currentUser && friend && this.validateFriend(friend)) {
        return this.userService.addFriends(currentUser, friend).pipe(
          switchMap(() => this.userService.addFriends(friend, currentUser)),
          finalize(() => {
            this.statusMessage = 'Lectura de QR exitosa';
            this.finishProcessCode(this.statusMessage);
          }),
        );
      } else {
        if (this.statusMessage == null) {
          this.statusMessage =
            'Error al leer el QR. Verifica su validez y vuelve a intentarlo';
        }
        this.finishProcessCode(this.statusMessage);
      }
      return of(friend);
    }),
  );

  processCode(code: string): void {
    this.subject$.next(code);
  }

  validateFriend(friend: AppUser): boolean {
    if (!friend) {
      this.statusMessage = 'El usuario no existe';
      return false;
    }

    if (this.currentUser()?.email === friend.email) {
      this.statusMessage = 'No se puede agregar a sí mismo como amigo';
      return false;
    }

    if (friend.friends?.includes(this.currentUser()?.email!)) {
      this.statusMessage = 'Ya es amigo';
      return false;
    }
    return true;
  }

  closeScanner(): void {
    this.dialogRef.close();
  }

  finishProcessCode(message: string) {
    this.closeScanner();
    if (message) {
      this.snackBar.open(message, 'Aceptar', {
        duration: 3000,
      });
    }
  }
}

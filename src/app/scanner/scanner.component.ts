import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { of, Subject, switchMap, tap } from 'rxjs';

import { AppUser } from '../core/models/app-user.model';
import { CurrentUserState } from '../core/states/current-user.state';
import { UserService } from '../core/services/user.service';
import { QrService } from '../core/services/qr.service';

@Component({
  selector: 'io-scanner',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    ZXingScannerModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
  template: `
    <ng-container *ngIf="friend$ | async as friend" />
    <h1 mat-dialog-title> Conecta </h1>

    <div mat-dialog-content>
      <div class="scanner__container">
        <div *ngIf="isScannActive" class="video-skeleton">
          <h2> Cargando el escáner </h2>
        </div>

        <zxing-scanner
          *ngIf="isScannActive"
          class="scanner"
          (scanSuccess)="processCode($event)"
        ></zxing-scanner>

        <div *ngIf="!isScannActive" class="loading">
          <mat-spinner></mat-spinner>
        </div>
      </div>
    </div>
    <span class="error-message" *ngIf="errorMessage">{{ errorMessage }}</span>

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

      .loading {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
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
  private qrService = inject(QrService);
  private currentUser = inject(CurrentUserState).currentUser;
  private dialogRef = inject(MatDialogRef<ScannerComponent>);

  errorMessage: string | null = null;
  isScannActive = true;

  friendSubject$ = new Subject<string>();
  friend$ = this.friendSubject$.pipe(
    tap(() => (this.isScannActive = false)),
    switchMap((friendEmail) => this.userService.getUserData(friendEmail)),
    switchMap((friend) => {
      const currentUser = this.currentUser();
      if (currentUser && friend && this.validateFriend(friend)) {
        return this.userService
          .addFriends(currentUser, friend)
          .pipe(
            switchMap(() => this.userService.addFriends(friend, currentUser)),
          );
      }
      return of(friend);
    }),
    tap(() => {
      this.closeScanner();
      this.isScannActive = true;
    }),
  );

  customQrSubject$ = new Subject<string>();
  customQr$ = this.customQrSubject$.pipe(
    tap(() => (this.isScannActive = false)),
    switchMap((qrId) => this.qrService.getQrData(qrId)),
    switchMap((qr) => {
      const currentUser = this.currentUser();
      return this.qrService.readQr(qr!, currentUser!);
    }),
    tap(() => {
      this.closeScanner();
      this.isScannActive = true;
    }),
  );

  processCode(qrData: string): void {
    if (!this.isScannActive) return;

    if (qrData.startsWith('{') && qrData.endsWith('}')) {
      const data = JSON.parse(qrData);
      if (!data.id) return;

      this.customQrSubject$.next(data.id);
      this.customQr$.subscribe();
    } else {
      this.friendSubject$.next(qrData);
    }
  }

  validateFriend(friend: AppUser): boolean {
    if (!friend) {
      this.errorMessage = 'El usuario no existe';
      return false;
    }

    if (this.currentUser()?.email === friend.email) {
      this.errorMessage = 'No se puede agregar a sí mismo como amigo';
      return false;
    }

    if (friend.friends?.includes(this.currentUser()?.email!)) {
      this.errorMessage = 'Ya es amigo';
      return false;
    }

    return true;
  }

  closeScanner(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {}
}

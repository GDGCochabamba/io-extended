import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { of, Subject, switchMap } from 'rxjs';

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
  errorMessage: string | null = null;

  subject$ = new Subject<string>();
  friend$ = this.subject$.pipe(
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
  );

  async processCode(friendEmail: string): Promise<void> {
    this.subject$.next(friendEmail);
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
}

import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { AppUser } from '../core/models/app-user.model';
import { CurrentUserState } from '../core/states/current-user.state';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'io-scanner',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ZXingScannerModule, NgIf],
  template: `
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
  private userState = inject(CurrentUserState);
  private dialogRef = inject(MatDialogRef<ScannerComponent>);
  errorMessage: string | null = null;

  async processCode(friendEmail: string): Promise<void> {
    const user: AppUser | undefined = this.userState.currentUser();
    const userEmail = user?.email;
    if (!userEmail || userEmail === friendEmail) {
      this.errorMessage = 'No se puede agregar a sí mismo como amigo';
      return;
    }

    const userDoc: AppUser | undefined =
      await this.userService.getUserData(friendEmail);
    if (!userDoc) {
      this.errorMessage = 'El usuario no existe';
      return;
    }

    const isFriend: boolean | undefined = userDoc.friends?.includes(userEmail);
    if (isFriend) {
      this.errorMessage = 'Ya es amigo';
      return;
    }

    const friendsDoc: AppUser | undefined =
      await this.userService.getUserData(friendEmail);
    if (friendsDoc && userEmail) {
      await this.userService.addFriends(user, friendsDoc);
      await this.userService.addFriends(friendsDoc, user);
    }

    this.errorMessage = null;
    return;
  }

  closeScanner(): void {
    this.dialogRef.close();
  }
}

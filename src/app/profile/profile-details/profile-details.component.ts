import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Subject, switchMap, tap } from 'rxjs';

import { AvatarImagePipe } from './avatar-image.pipe';
import { AuthService } from '../../core/services/auth.service';
import { CurrentUserState } from '../../core/states/current-user.state';
import { ProfileFriendsComponent } from '../profile-friends/profile-friends.component';

@Component({
  selector: 'io-profile-details',
  standalone: true,
  imports: [
    AsyncPipe,
    AvatarImagePipe,
    MatCardModule,
    MatButtonModule,
    NgIf,
    ProfileFriendsComponent,
    QRCodeModule,
  ],
  template: `
    <ng-container *ngIf="signOut$ | async"></ng-container>

    <mat-card>
      <mat-card-header>
        <div
          mat-card-avatar
          class="profile-details__avatar"
          [style.background-image]="user()?.photoURL | avatarImage"
        ></div>
        <mat-card-title>
          {{ user()?.displayName || user()?.email }}
        </mat-card-title>
        <mat-card-subtitle> {{ user()?.email }} </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="profile-details__qrcode-container">
          <qrcode
            elementType="img"
            errorCorrectionLevel="M"
            [qrdata]="user()?.email || 'no user'"
            [width]="256"
          ></qrcode>
        </div>
      </mat-card-content>

      <mat-card-actions class="profile-details__actions">
        <button mat-button (click)="signOutSubject$.next()">
          Cerrar Sesión
        </button>
      </mat-card-actions>
    </mat-card>
    <io-profile-friends></io-profile-friends>
  `,
  styles: [
    `
      .profile-details__avatar {
        background-size: cover;
      }

      .profile-details__qrcode-container {
        text-align: center;
        width: 100%;
      }

      .profile-details__actions {
        justify-content: center;
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export default class ProfileDetailsComponent {
  user = inject(CurrentUserState).currentUser;

  private auth = inject(AuthService);

  private router = inject(Router);

  signOutSubject$ = new Subject<void>();
  signOut$ = this.signOutSubject$.pipe(
    switchMap(() => this.auth.signOut()),
    tap({ next: () => this.router.navigate(['/profile/login']) }),
  );
}

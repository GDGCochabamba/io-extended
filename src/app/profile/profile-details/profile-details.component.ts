import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Subject, switchMap, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { AvatarImagePipe } from './avatar-image.pipe';
import { AuthService } from '../../core/services/auth.service';
import { CurrentUserState } from '../../core/states/current-user.state';

import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileFriendsComponent } from '../profile-friends/profile-friends.component';

@Component({
  selector: 'io-profile-details',
  standalone: true,
  imports: [
    AsyncPipe,
    AvatarImagePipe,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HttpClientModule,
    NgIf,
    NgFor,
    QRCodeModule,
    MatExpansionModule,
    ProfileFriendsComponent,
    RouterLink,
  ],
  template: `
    <ng-container *ngIf="signOut$ | async"></ng-container>

    <mat-card>
      <mat-card-header>
        <div
          class="profile-details__avatar"
          [style.background-image]="user()?.photoURL | avatarImage"
        ></div>

        <div class="profile-details__info-container">
          <span class="profile-details__info-fullname">{{
            user()?.displayName || user()?.email
          }}</span>
          <br />
          <span class="profile-details__info-email">{{ user()?.email }}</span>
          <br />
        </div>
        <div class="profile-details__score-container">
          <span class="profile-details__score">{{ user()?.score }}</span> Puntos
        </div>
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
        <div
          class="profile-details__social-medial-container"
          *ngIf="hasSocialMedia == true"
        >
          <mat-divider></mat-divider>
          <h3 class="profile-details__social-medial-title">Redes Sociales</h3>
          <ul class="profile-details__social-media-list">
            <li
              *ngIf="user()?.facebookUsername !== ''"
              class="profile-details__social-media-item"
            >
              <span class="profile-details__social-media-platform"
                >Facebook:
              </span>
              <span class="profile-details__social-media-username">{{
                user()?.facebookUsername
              }}</span>
            </li>
            <li
              *ngIf="user()?.twitterUsername !== ''"
              class="profile-details__social-media-item"
            >
              <span class="profile-details__social-media-platform"
                >Twitter:
              </span>
              <span class="profile-details__social-media-username">{{
                user()?.twitterUsername
              }}</span>
            </li>
            <li
              *ngIf="user()?.instagramUsername !== ''"
              class="profile-details__social-media-item"
            >
              <span class="profile-details__social-media-platform"
                >Instagram:
              </span>
              <span class="profile-details__social-media-username">{{
                user()?.instagramUsername
              }}</span>
            </li>
            <li
              *ngIf="user()?.githubUsername !== ''"
              class="profile-details__social-media-item"
            >
              <span class="profile-details__social-media-platform"
                >Github:
              </span>
              <span class="profile-details__social-media-username">{{
                user()?.githubUsername
              }}</span>
            </li>
            <li
              *ngIf="user()?.linkedinUsername !== ''"
              class="profile-details__social-media-item"
            >
              <span class="profile-details__social-media-platform"
                >Linkedin:
              </span>
              <span class="profile-details__social-media-username">{{
                user()?.linkedinUsername
              }}</span>
            </li>
          </ul>
        </div>
      </mat-card-content>
      <mat-card-actions class="profile-details__actions-container">
        <button
          class="profile-details__edit-button"
          mat-raised-button
          color="primary"
          routerLink="/profile/edit"
        >
          Editar perfil
        </button>
        <button
          class="profile-details__sign-out-button"
          mat-raised-button
          color="warn"
          (click)="signOutSubject$.next()"
        >
          Cerrar Sesión
        </button>
      </mat-card-actions>
    </mat-card>
    <io-profile-friends></io-profile-friends>
  `,
  styles: [
    `
      .mat-mdc-card-header {
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .profile-details__avatar {
        background-size: cover;
        width: 100px;
        height: 100px;
        border-radius: 20%;
      }
      .profile-details__info-container {
        color: #737373;
        text-align: center;
        margin-top: 15px;
      }
      .profile-details__info-fullname {
        font-size: 22px;
        color: #3f51b5;
        font-weight: bold;
      }
      .profile-details__info-email {
        color: #737373;
      }

      .profile-details__score-container {
        margin-top: 8px;
        color: #3f51b5;
      }
      .profile-details__score {
        font-size: 26px;
      }

      .profile-details__qrcode-container {
        text-align: center;
        width: 100%;
      }

      .buttons {
        justify-content: center;
        margin-bottom: 0.5rem;
      }

      .profile-details__social-medial-title {
        margin: 12px 0px 5px 0px;
        color: #3f51b5;
        font-weight: bolder;
        font-size: 16px;
      }

      .profile-details__social-media-list {
        list-style-type: none;
        padding: 0;
      }
      .profile-details__social-media-icon {
        color: #000;
      }
      .profile-details__social-media-item {
        color: #464646;
        height: 40px;
        display: flex;
        align-items: center;
      }
      .profile-details__social-media-username {
        font-weight: bolder;
        font-size: 16px;
        margin-left: 10px;
      }
      .profile-details__social-media-platform {
        font-size: 13px;
        color: #464646;
      }
      .profile-details__edit-button,
      .profile-details__sign-out-button {
        width: 45%;
      }

      .profile-details__actions-container {
        padding: 0px 16px 16px 16px;
        justify-content: space-around;
      }
    `,
  ],
})
export default class ProfileDetailsComponent {
  user = inject(CurrentUserState).currentUser;
  hasSocialMedia =
    this.user()?.facebookUsername !== '' ||
    this.user()?.twitterUsername !== '' ||
    this.user()?.instagramUsername !== '' ||
    this.user()?.githubUsername !== '' ||
    this.user()?.linkedinUsername !== '';

  private auth = inject(AuthService);

  private router = inject(Router);
  constructor(private matIconRegistry: MatIconRegistry) {
    // Add social media svg icons
    this.matIconRegistry.addSvgIcon(
      'twitter',
      'assets/social-media-icons/twitter.svg',
    );
  }

  signOutSubject$ = new Subject<void>();
  signOut$ = this.signOutSubject$.pipe(
    switchMap(() => this.auth.signOut()),
    tap({ next: () => this.router.navigate(['/profile/login']) }),
  );
}

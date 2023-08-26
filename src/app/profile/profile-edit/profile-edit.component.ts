import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CurrentUserState } from '../../core/states/current-user.state';
import { MatIconModule } from '@angular/material/icon';
import { Subject, switchMap, tap } from 'rxjs';

import { AvatarImagePipe } from '../profile-details/avatar-image.pipe';
import { UserService } from '../../core/services/user.service';
import { LoadingState } from '../../core/states/loading.state';
@Component({
  selector: 'io-profile-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    AvatarImagePipe,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <ng-container *ngIf="editProfile$ | async"></ng-container>

    <mat-card class="profile-edit-container">
      <div
        class="profile-edit__avatar"
        [style.background-image]="user()?.photoURL | avatarImage"
      ></div>

      <mat-card-content>
        <form
          class="profile-edit"
          [formGroup]="profileEditForm"
          (ngSubmit)="profileEdit()"
        >
          <mat-form-field>
            <mat-label> Nombre Completo </mat-label>
            <input matInput formControlName="displayName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label> Correo Electrónico </mat-label>
            <input matInput formControlName="email" readonly="true" />
          </mat-form-field>

          <mat-divider></mat-divider>

          <h3 class="profile-edit__social-media-title">Redes Sociales</h3>
          <p class="profile-edit__social-media-description"
            >Agrega tus redes para fortalecer tus lazos y conocer más amigos.</p
          >
          <mat-form-field>
            <mat-label> Facebook </mat-label>
            <input matInput formControlName="facebookUsername" />
          </mat-form-field>
          <mat-form-field>
            <mat-label> Instagram </mat-label>
            <input matInput formControlName="instagramUsername" />
          </mat-form-field>
          <mat-form-field>
            <mat-label> Twitter </mat-label>
            <input matInput formControlName="twitterUsername" />
          </mat-form-field>
          <mat-form-field>
            <mat-label> GitHub </mat-label>
            <input matInput formControlName="githubUsername" />
          </mat-form-field>
          <mat-form-field>
            <mat-label> LinkedIn </mat-label>
            <input matInput formControlName="linkedinUsername" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="profileEditForm.invalid || loading()"
            (click)="profileEdit()"
          >
            Editar Perfil
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .profile-edit {
        display: flex;
        flex-direction: column;
      }

      .profile-edit__avatar {
        background-size: cover;
        width: 100px;
        height: 100px;
        border-radius: 20%;
        margin: 20px auto 20px auto;
      }

      .profile-edit__social-media-title {
        margin: 12px 0px 5px 0px;
        color: #3f51b5;
        font-weight: bolder;
        font-size: 16px;
      }

      .profile-edit__social-media-description {
        color: #737373;
      }
    `,
  ],
})
export default class ProfileEditComponent {
  user = inject(CurrentUserState).currentUser;
  private userService = inject(UserService);

  private router = inject(Router);

  loading = inject(LoadingState).loading;
  profileEditForm = inject(FormBuilder).group({
    displayName: [
      this.user()?.displayName || this.user()?.email,
      [Validators.required],
    ],
    email: [this.user()?.email, [Validators.required, Validators.email]],
    facebookUsername: [this.user()?.facebookUsername],
    instagramUsername: [this.user()?.instagramUsername],
    twitterUsername: [this.user()?.twitterUsername],
    githubUsername: [this.user()?.githubUsername],
    linkedinUsername: [this.user()?.linkedinUsername],
  });

  editProfileSubject$ = new Subject<void>();
  editProfile$ = this.editProfileSubject$.pipe(
    switchMap(() => {
      const email = this.user()?.email || '';
      if (!email) {
        throw new Error('Email no existe!');
      }
      const userData = this.profileEditForm.value;
      return this.userService.editUser(email, userData);
    }),
    tap({ next: () => this.router.navigate(['/profile/details']) }),
  );

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.profileEditForm.disable();
      } else {
        this.profileEditForm.enable();
      }
    });
  }

  profileEdit(): void {
    if (this.profileEditForm.invalid) {
      return;
    }
    this.editProfileSubject$.next();
  }
}

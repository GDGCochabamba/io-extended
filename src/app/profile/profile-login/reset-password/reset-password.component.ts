import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { LoadingState } from '../../../core/states/loading.state';

@Component({
  selector: 'io-reset-password',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <ng-container *ngIf="resetPassword$ | async"></ng-container>

    <mat-card>
      <img
        mat-card-image
        src="assets/img/io-banner.jpg"
        alt="Banner del I/O extended"
      />

      <mat-card-content>
        <form
          class="reset-password"
          [formGroup]="resetPasswordForm"
          (ngSubmit)="resetPassword()"
        >
          <mat-form-field>
            <mat-label> Correo Electrónico </mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="resetPasswordForm.invalid || loading()"
          >
            Cambiar Contraseña
          </button>

          <div class="reset-password__sign-in-container">
            <a routerLink="../sign-in"> Iniciar Sesión </a>
          </div>
        </form>
      </mat-card-content>

      <mat-card-footer *ngIf="loading()">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </mat-card-footer>
    </mat-card>
  `,
  styles: [
    `
      .reset-password {
        display: flex;
        flex-direction: column;
      }

      .reset-password__sign-in-container {
        margin: 22px 0;
        text-align: center;
      }
    `,
  ],
})
export default class ResetPasswordComponent {
  loading = inject(LoadingState).loading;
  resetPasswordForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  private auth = inject(AuthService);
  private resetPasswordSubject$ = new Subject<string>();
  resetPassword$ = this.resetPasswordSubject$.pipe(
    switchMap((email) => this.auth.sendPasswordResetEmail(email)),
    tap({ next: () => this.router.navigate(['/profile/login']) }),
  );

  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.resetPasswordForm.disable();
      } else {
        this.resetPasswordForm.enable();
      }
    });
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { email } = this.resetPasswordForm.value;

    if (email) {
      this.resetPasswordSubject$.next(email);
    }
  }
}

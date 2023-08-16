import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { SignFormComponent } from '../sign-form/sign-form.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'io-sign-in',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, SignFormComponent],
  template: `
    <ng-container *ngIf="signIn$ | async"></ng-container>
    <ng-container *ngIf="signInWithGoogle$ | async"></ng-container>

    <io-sign-form
      (submitForm)="signInSubject$.next($event)"
      (signInWithGoogle)="signInWithGoogleSubject$.next()"
    >
      <a
        passwordAction
        class="sign-in__reset-link"
        routerLink="../reset-password"
      >
        ¿Olvidaste tu contraseña?
      </a>

      <div additionalAction class="sign-in__sign-up-container">
        ¿No tienes cuenta?
        <a routerLink="../sign-up"> Regístrate </a>
      </div>

      <ng-container submitLabel> Iniciar Sesión </ng-container>
    </io-sign-form>
  `,
  styles: [
    `
      .sign-in__reset-link {
        margin-left: auto;
      }

      .sign-in__sign-up-container {
        margin: 22px 0;
        text-align: center;
      }
    `,
  ],
})
export default class SignInComponent {
  private auth = inject(AuthService);

  signInSubject$ = new Subject<{ email: string; password: string }>();
  signIn$ = this.signInSubject$.pipe(
    switchMap(({ email, password }) => this.auth.signIn(email, password)),
    tap({ next: (response) => this.handleSignInResponse(response) }),
  );

  signInWithGoogleSubject$ = new Subject<void>();
  signInWithGoogle$ = this.signInWithGoogleSubject$.pipe(
    switchMap(() => this.auth.signInWithGoogle()),
    tap({ next: (response) => this.handleSignInResponse(response) }),
  );

  private router = inject(Router);

  private handleSignInResponse(response: UserCredential | undefined): void {
    if (!response) {
      return;
    }

    this.router.navigate(['/profile/details']);
  }
}

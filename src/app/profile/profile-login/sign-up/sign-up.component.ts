import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { SignFormComponent } from '../sign-form/sign-form.component';
import { AppUser } from '../../../core/models/app-user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'io-sign-up',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, SignFormComponent],
  template: `
    <ng-container *ngIf="signUp$ | async"></ng-container>
    <ng-container *ngIf="signInWithGoogle$ | async"></ng-container>

    <io-sign-form
      (submitForm)="signUpSubject$.next($event)"
      (signInWithGoogle)="signInWithGoogleSubject$.next()"
    >
      <div additionalAction class="sign-up__sign-in-container">
        ¿Ya tienes una cuenta?
        <a routerLink="../sign-in"> Iniciar Sesión </a>
      </div>

      <ng-container submitLabel> Registrarse </ng-container>
    </io-sign-form>
  `,
  styles: [
    `
      .sign-up__sign-in-container {
        margin: 22px 0;
        text-align: center;
      }
    `,
  ],
})
export default class SignUpComponent {
  private auth = inject(AuthService);

  signUpSubject$ = new Subject<{ email: string; password: string }>();
  signUp$ = this.signUpSubject$.pipe(
    switchMap(({ email, password }) => this.auth.signUp(email, password)),
    tap({ next: (response) => this.handleSignUpResponse(response) }),
  );

  signInWithGoogleSubject$ = new Subject<void>();
  signInWithGoogle$ = this.signInWithGoogleSubject$.pipe(
    switchMap(() => this.auth.signInWithGoogle()),
    tap({ next: (response) => this.handleSignUpResponse(response) }),
  );

  private router = inject(Router);

  private handleSignUpResponse(response: AppUser | undefined): void {
    if (!response) {
      return;
    }

    this.router.navigate(['/profile/login']);
  }
}

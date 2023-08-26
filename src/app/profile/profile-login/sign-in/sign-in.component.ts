import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { SignFormComponent } from '../sign-form/sign-form.component';
import { AppUser } from '../../../core/models/app-user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'io-sign-in',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, SignFormComponent],
  template: `
    <ng-container *ngIf="sendSignInEmail$ | async"></ng-container>
    <ng-container *ngIf="signInWithGoogle$ | async"></ng-container>

    <io-sign-form
      (submitForm)="sendSignInEmailSubject$.next($event)"
      (signInWithGoogle)="signInWithGoogleSubject$.next()"
    >
      <ng-container submitLabel>
        Mandar Enlace de Inicio de Sesión
      </ng-container>
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

  sendSignInEmailSubject$ = new Subject<string>();
  sendSignInEmail$ = this.sendSignInEmailSubject$.pipe(
    switchMap((email) => this.auth.sendSignInEmail(email)),
  );

  signInWithGoogleSubject$ = new Subject<void>();
  signInWithGoogle$ = this.signInWithGoogleSubject$.pipe(
    switchMap(() => this.auth.signInWithGoogle()),
    tap({ next: (response) => this.handleSignInResponse(response) }),
  );

  private router = inject(Router);

  private handleSignInResponse(response: AppUser | undefined): void {
    console.log('handling sign in', response);
    if (!response) {
      return;
    }

    this.router.navigate(['/profile/details']);
  }
}

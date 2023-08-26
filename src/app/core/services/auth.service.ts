import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Observable, catchError, from, of, switchMap, tap } from 'rxjs';

import { UserService } from './user.service';
import { LoggerService } from './logger.service';
import { handleError } from '../functions/handle-error.function';
import { loadEffect } from '../functions/load-effect.function';
import { AppUser } from '../models/app-user.model';
import { CurrentUserState } from '../states/current-user.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userService = inject(UserService);

  private userState = inject(CurrentUserState);

  private auth = inject(Auth);
  user$ = user(this.auth).pipe(
    switchMap((user) => {
      return this.getCurrentUser(user);
    }),
  );

  private googleProvider = new GoogleAuthProvider();

  private loadEffectObserver = loadEffect();

  private logger = inject(LoggerService);

  sendSignInEmail(email: string): Observable<void | undefined> {
    const actionCodeSettings = {
      url: 'http://localhost:4200/profile/login/confirm-email',
      handleCodeInApp: true,
    };

    return from(
      sendSignInLinkToEmail(this.auth, email, actionCodeSettings),
    ).pipe(
      tap(this.loadEffectObserver),
      tap({
        next: () => {
          localStorage.setItem('emailForSignIn', email);
          this.logger.handleSuccess(
            'Revisa la bandeja de entrada de tu correo.',
          );
        },
      }),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signInWithEmailLink(): Observable<AppUser | undefined> {
    console.log(this.auth);
    console.log(location.href);
    if (!isSignInWithEmailLink(this.auth, location.href)) {
      console.log('fail');
      return of(undefined);
    }

    let email = localStorage.getItem('emailForSignIn');

    if (!email) {
      email = prompt('Please provide your email for confirmation');
    }

    return from(signInWithEmailLink(this.auth, email!, location.href)).pipe(
      tap(this.loadEffectObserver),
      tap({ next: () => localStorage.removeItem('emailForSignIn') }),
      switchMap(({ user }) => this.userService.createUser(user)),
      tap((user) => this.userState.setUser(user)),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signInWithGoogle(): Observable<AppUser | undefined> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      tap(this.loadEffectObserver),
      switchMap(({ user }) => this.userService.createUser(user)),
      tap((user) => this.userState.setUser(user)),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signOut(): Observable<void | undefined> {
    return from(this.auth.signOut()).pipe(
      tap(this.loadEffectObserver),
      tap(() => this.userState.cleanUser()),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  private getCurrentUser(user: User | null): Observable<AppUser | undefined> {
    if (!user) {
      return of(undefined);
    }

    if (this.userState.currentUser()) {
      return of(this.userState.currentUser());
    }

    return this.userService
      .getUser(user.email || '')
      .pipe(tap((user) => this.userState.setUser(user)));
  }
}

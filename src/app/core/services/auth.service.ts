import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
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

  signIn(email: string, password: string): Observable<AppUser | undefined> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(this.loadEffectObserver),
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

  signUp(email: string, password: string): Observable<AppUser | undefined> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      tap(this.loadEffectObserver),
      switchMap(({ user }) => this.userService.createUser(user)),
      tap({
        next: () => this.logger.handleSuccess('Usuario creado exitosamente.'),
      }),
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

  sendPasswordResetEmail(email: string): Observable<void | undefined> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      tap(this.loadEffectObserver),
      tap({
        next: () =>
          this.logger.handleSuccess(
            'Correo electrónico de restablecimiento de contraseña enviado.',
          ),
      }),
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

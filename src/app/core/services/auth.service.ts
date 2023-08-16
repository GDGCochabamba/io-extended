import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Observable, catchError, from, tap } from 'rxjs';

import { LoggerService } from './logger.service';
import { handleError } from '../functions/handle-error.function';
import { loadEffect } from '../functions/load-effect.function';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);

  private googleProvider = new GoogleAuthProvider();

  private loadEffectObserver = loadEffect();

  private logger = inject(LoggerService);

  signUp(
    email: string,
    password: string,
  ): Observable<UserCredential | undefined> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      tap(this.loadEffectObserver),
      tap({
        next: () => this.logger.handleSuccess('Usuario creado exitosamente.'),
      }),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signIn(
    email: string,
    password: string,
  ): Observable<UserCredential | undefined> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(this.loadEffectObserver),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signOut(): Observable<void | undefined> {
    return from(this.auth.signOut()).pipe(
      tap(this.loadEffectObserver),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  signInWithGoogle(): Observable<UserCredential | undefined> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      tap(this.loadEffectObserver),
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
}

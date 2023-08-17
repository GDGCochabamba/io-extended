import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of, switchMap, tap } from 'rxjs';

import { LoggerService } from './logger.service';
import { handleError } from '../functions/handle-error.function';
import { loadEffect } from '../functions/load-effect.function';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private db = inject(Firestore);

  private loadEffectObserver = loadEffect();

  private logger = inject(LoggerService);

  getUser(email: string): Observable<AppUser | undefined> {
    const docRef = doc(this.db, 'users', email);

    return (docData(docRef) as Observable<AppUser>).pipe(
      tap(this.loadEffectObserver),
      catchError((error) => handleError(error, this.logger)),
    );
  }

  createUser({
    email,
    displayName,
    photoURL,
  }: User): Observable<AppUser | undefined> {
    const docRef = doc(this.db, 'users', email || '');
    const appUser: AppUser = { email, displayName, photoURL };

    return this.getUser(email || '').pipe(
      tap(this.loadEffectObserver),
      switchMap((user) => {
        if (user) {
          return of(user);
        }

        return from(setDoc(docRef, appUser)).pipe(map(() => appUser));
      }),
      catchError((error) => handleError(error, this.logger)),
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

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

  async getUserData(email: string): Promise<AppUser | undefined> {
    const docRef = doc(this.db, 'users', email);
    const docData = await getDoc(docRef);
    return docData.data() as AppUser | undefined;
  }

  addFriends(user: AppUser, friendUser: AppUser): Observable<void> {
    const friends = user?.friends || [];
    const newFriends = [...new Set([...friends, friendUser.email!])];
    const points = user?.score || 0;
    const newPoints = points + 20;

    const docRef = doc(this.db, 'users', user.email!);
    return from(
      updateDoc(docRef, { friends: newFriends, score: newPoints }),
    ).pipe(
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
    const appUser: AppUser = {
      email,
      displayName,
      photoURL,
      friends: [],
      score: 0,
      facebookUsername: '',
      instagramUsername: '',
      twitterUsername: '',
      githubUsername: '',
      linkedinUsername: '',
    };

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

  editUser(email: string, userData: any): Observable<void> {
    const docRef = doc(this.db, 'users', email);
    return from(updateDoc(docRef, userData)).pipe(
      tap(this.loadEffectObserver),
      catchError((error) => handleError(error, this.logger)),
    );
  }
}

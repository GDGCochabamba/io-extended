import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, catchError, finalize, from, tap } from 'rxjs';

import { AppQr } from '../models/app-qr.model';
import { handleError } from '../functions/handle-error.function';
import { LoggerService } from './logger.service';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private db = inject(Firestore);
  private logger = inject(LoggerService);

  getQrById(id: string): Observable<AppQr | undefined> {
    const docRef = doc(this.db, 'qrs', id);

    return (docData(docRef) as Observable<AppQr | undefined>).pipe(
      catchError((error) => handleError(error, this.logger)),
    );
  }

  async getQrData(id: string) {
    const docRef = doc(this.db, 'qrs', id);
    const docData = await getDoc(docRef);
    return docData.data() as AppQr | undefined;
  }

  readQr(qr: AppQr, user: AppUser) {
    const balance = qr?.balance ?? 0;

    if (qr.users?.includes(user.email!)) {
      return from(Promise.reject('Ya has escaneado este código')).pipe(
        catchError((error) => handleError(error, this.logger)),
      );
    }

    if (balance <= 0) {
      return from(Promise.reject('No existen más puntos')).pipe(
        catchError((error) => handleError(error, this.logger)),
      );
    }

    const users = qr?.users ?? [];
    const newUsers = [...new Set([...users, user.email!])];
    const newBalance = balance - 1;

    const docRef = doc(this.db, 'qrs', qr.id);
    return from(
      updateDoc(docRef, { users: newUsers, balance: newBalance }),
    ).pipe(
      catchError((error) => handleError(error, this.logger)),
      finalize(() => {
        const docRef = doc(this.db, 'users', user.email!);
        const currentScore = user.score ?? 0;
        const newScore = currentScore + qr.points;

        updateDoc(docRef, { score: newScore });
      }),
    );
  }
}

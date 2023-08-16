import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'io-profile-details',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: `
    <ng-container *ngIf="signOut$ | async"></ng-container>

    <p> profile-details works! </p>

    <button (click)="signOutSubject$.next()"> Cerrar Sesión </button>
  `,
})
export default class ProfileDetailsComponent {
  private auth = inject(AuthService);

  private router = inject(Router);

  signOutSubject$ = new Subject<void>();
  signOut$ = this.signOutSubject$.pipe(
    switchMap(() => this.auth.signOut()),
    tap({ next: () => this.router.navigate(['/profile/login']) }),
  );
}

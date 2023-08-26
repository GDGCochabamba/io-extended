import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap, tap } from 'rxjs';

import { AppUser } from '../../../core/models/app-user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'io-confirm-email',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: ` <ng-container *ngIf="signIn$ | async"></ng-container> `,
})
export default class ConfirmEmailComponent implements OnInit, AfterViewInit {
  private auth = inject(AuthService);
  signInSubject$ = new Subject<void>();
  signIn$ = this.signInSubject$.pipe(
    switchMap(() => this.auth.signInWithEmailLink()),
    tap({ next: (response) => this.handleSignInResponse(response) }),
  );

  private router = inject(Router);

  constructor() {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log('init');
    this.auth.signInWithEmailLink();
  }

  ngAfterViewInit(): void {
    console.log('after');
  }

  private handleSignInResponse(response: AppUser | undefined): void {
    if (!response) {
      this.router.navigate(['/profile/login/sign-in']);
      return;
    }

    this.router.navigate(['/profile/details']);
  }
}

import { Injectable, computed, signal } from '@angular/core';

import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserState {
  currentUser = computed(() => this.user());

  private user = signal<AppUser | undefined>(undefined);

  setUser(user: AppUser | undefined): void {
    this.user.set(user);
  }

  cleanUser(): void {
    this.user.set(undefined);
  }
}

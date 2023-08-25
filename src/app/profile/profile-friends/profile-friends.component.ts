import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { CurrentUserState } from 'src/app/core/states/current-user.state';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'io-profile-friends',
  standalone: true,
  imports: [AsyncPipe, MatExpansionModule, MatIconModule, NgFor, NgIf],
  template: `
    <h1 class="profile-friends__title">Amigos</h1>
    <ng-container *ngFor="let item$ of friends">
      <mat-accordion>
        <mat-expansion-panel
          (opened)="panelOpenState = true"
          (closed)="panelOpenState = false"
          class="profile-friends__panel"
        >
          <mat-expansion-panel-header>
            <mat-panel-title class="profile-friends__name">
              {{ (item$ | async)?.displayName }}
            </mat-panel-title>

            <mat-panel-description>
              <ng-container *ngIf="(item$ | async)?.photoURL; else noPhoto">
                <img
                  class="profile-friends__avatar"
                  [src]="(item$ | async)?.photoURL"
                  alt="Foto"
                />
              </ng-container>

              <ng-template #noPhoto>
                <mat-icon>account_circle</mat-icon>
              </ng-template>
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>{{ (item$ | async)?.email }}</p>
        </mat-expansion-panel>
      </mat-accordion>
    </ng-container>
  `,
  styles: [
    `
      .profile-friends__title {
        margin-top: 2rem;
        margin-left: 0.5rem;
      }

      .profile-friends__panel {
        margin-bottom: 12px;
      }

      .profile-friends__name {
        display: flex;
        flex-grow: 15;
        flex-basis: 0;
        margin-right: 16px;
        align-items: center;
      }

      .profile-friends__avatar {
        border-radius: 50%;
        width: 35px;
        height: 35px;
      }
    `,
  ],
})
export class ProfileFriendsComponent {
  private userService = inject(UserService);

  user = inject(CurrentUserState).currentUser;
  friends = this.user()?.friends?.map((email) =>
    this.userService.getUser(email),
  );

  panelOpenState = false;
}

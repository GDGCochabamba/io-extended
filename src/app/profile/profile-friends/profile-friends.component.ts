import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../core/services/user.service';
import { CurrentUserState } from '../../core/states/current-user.state';

@Component({
  selector: 'io-profile-friends',
  standalone: true,
  imports: [AsyncPipe, MatExpansionModule, MatIconModule, NgFor, NgIf],
  template: `
    <h1>Amigos</h1>
    <ng-container *ngFor="let item$ of friends">
      <ng-container *ngIf="item$ | async as item">
        <mat-accordion class="headers-align">
          <mat-expansion-panel
            (opened)="panelOpenState = true"
            (closed)="panelOpenState = false"
            class="profile-friends__box"
          >
            <mat-expansion-panel-header>
              <mat-panel-title class="profile-friends__title">
                {{ item.displayName }}
              </mat-panel-title>

              <mat-panel-description>
                <ng-container *ngIf="item.photoURL; else noPhoto">
                  <img
                    class="profile-friends__picture"
                    alt="Foto de perfil"
                    [src]="item.photoURL"
                  />
                </ng-container>

                <ng-template #noPhoto>
                  <mat-icon>account_circle</mat-icon>
                </ng-template>
              </mat-panel-description>
            </mat-expansion-panel-header>

            <p>{{ item.email }}</p>
          </mat-expansion-panel>
        </mat-accordion>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .profile-friends__box {
        margin-bottom: 12px;
      }

      h1 {
        margin-top: 2rem;
        margin-left: 0.5rem;
      }

      .profile-friends__title {
        display: flex;
        flex-grow: 15;
        flex-basis: 0;
        margin-right: 16px;
        align-items: center;
      }

      .profile-friends__picture {
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

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CurrentUserState } from 'src/app/core/states/current-user.state';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'io-profile-friends',
  standalone: true,
  template: `
    <h1>Amigos</h1>
    <ng-container *ngFor="let item$ of friends">
      <mat-accordion class="headers-align">
        <mat-expansion-panel
          (opened)="panelOpenState = true"
          (closed)="panelOpenState = false"
          class="box"
        >
          <mat-expansion-panel-header>
            <mat-panel-title class="title">
              {{ (item$ | async)?.displayName }}
            </mat-panel-title>

            <mat-panel-description>
              <ng-container *ngIf="(item$ | async)?.photoURL; else noPhoto">
                <img
                  class="imagen"
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
      .box {
        margin-bottom: 12px;
      }

      h1 {
        margin-top: 2rem;
        margin-left: 0.5rem;
      }

      .title {
        display: flex;
        flex-grow: 15;
        flex-basis: 0;
        margin-right: 16px;
        align-items: center;
      }

      .imagen {
        border-radius: 50%;
        width: 35px;
        height: 35px;
      }
    `,
  ],
  imports: [CommonModule, MatExpansionModule, MatIconModule, NgFor, NgIf],
})
export class ProfileFriendsComponent {
  private userService = inject(UserService);

  user = inject(CurrentUserState).currentUser;
  friends = this.user()?.friends?.map((email) =>
    this.userService.getUser(email),
  );

  panelOpenState = false;
}

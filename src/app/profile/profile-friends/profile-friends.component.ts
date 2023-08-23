import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrentUserState } from 'src/app/core/states/current-user.state';

@Component({
  selector: 'io-profile-friends',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  template: `
    <h1>Amigos</h1>
    <mat-accordion class="headers-align">
      <mat-expansion-panel
        (opened)="panelOpenState = true"
        (closed)="panelOpenState = false"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="title">
            {{ user()?.displayName }}
          </mat-panel-title>

          <mat-panel-description>
            <img class="imagen" [src]="user()?.photoURL" alt="Foto" />
          </mat-panel-description>
        </mat-expansion-panel-header>

        <p>{{ user()?.email }}</p>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [
    `
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
})
export default class ProfileFriendsComponent {
  user = inject(CurrentUserState).currentUser;
  panelOpenState = false;
}

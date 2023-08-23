import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CurrentUserState } from 'src/app/core/states/current-user.state';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { mockUser } from './mockUser';

@Component({
  selector: 'io-profile-friends',
  standalone: true,
  template: `
    <h1>Amigos</h1>
    <ng-container *ngFor="let item of us.friends">
      <mat-accordion class="headers-align">
        <mat-expansion-panel
          (opened)="panelOpenState = true"
          (closed)="panelOpenState = false"
          class="box"
        >
          <mat-expansion-panel-header>
            <mat-panel-title class="title">
              {{ item.displayName }}
            </mat-panel-title>

            <mat-panel-description>
              <ng-container *ngIf="item.photoURL; else noPhoto">
                <img class="imagen" [src]="item.photoURL" alt="Foto" />
              </ng-container>

              <ng-template #noPhoto>
                <mat-icon>account_circle</mat-icon>
              </ng-template>
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>{{ item.email }}</p>

          <ng-container *ngFor="let redes of item.redesSociales">
            <p>{{ redes }}</p>
          </ng-container>
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
  imports: [CommonModule, MatExpansionModule, MatIconModule],
})
export class ProfileFriendsComponent {
  user = inject(CurrentUserState).currentUser;
  us = mockUser;
  panelOpenState = false;
}

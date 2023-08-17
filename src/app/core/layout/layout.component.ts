import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { CurrentUserState } from '../states/current-user.state';
import { LoadingState } from '../states/loading.state';
import { ScannerComponent } from '../../scanner/scanner.component';

@Component({
  selector: 'io-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    NgFor,
    NgIf,
    RouterLink,
  ],
  template: `
    <mat-sidenav-container class="layout">
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span> I/O Extended Cochabamba </span>

          <a
            mat-icon-button
            class="layout__profile-button"
            routerLink="/profile"
          >
            <mat-icon> account_circle </mat-icon>
          </a>
        </mat-toolbar>

        <nav mat-tab-nav-bar backgroundColor="primary" [tabPanel]="tabPanel">
          <a
            mat-tab-link
            *ngFor="let item of LINKS_DATA"
            [active]="(activeLink$ | async)?.includes(item.link)"
            [routerLink]="item.link"
          >
            {{ item.label }}
          </a>
        </nav>

        <mat-progress-bar
          *ngIf="loading()"
          mode="indeterminate"
        ></mat-progress-bar>

        <mat-tab-nav-panel #tabPanel>
          <div class="container">
            <ng-content></ng-content>
          </div>
        </mat-tab-nav-panel>

        <button
          *ngIf="user()"
          mat-fab
          class="layout__scanner-button"
          color="primary"
          (click)="openScanner()"
        >
          <mat-icon>qr_code_scanner</mat-icon>
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .layout {
        height: 100%;

        .layout__profile-button {
          margin-left: auto;
        }

        .layout__scanner-button {
          bottom: 15px;
          position: fixed;
          right: 15px;
          z-index: 1;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  loading = inject(LoadingState).loading;

  user = inject(CurrentUserState).currentUser;

  private router = inject(Router);
  activeLink$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url),
  );

  readonly LINKS_DATA = [
    { link: '/profile', label: 'Perfil' },
    { link: '/ranking', label: 'Ranking' },
    { link: '/schedule', label: 'Agenda' },
  ];

  private dialog = inject(MatDialog);

  openScanner(): void {
    this.dialog.open(ScannerComponent);
  }
}

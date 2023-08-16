import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'io-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    NgFor,
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
            *ngFor="let item of linksData"
            [active]="(activeLink$ | async)?.includes(item.link)"
            [routerLink]="item.link"
          >
            {{ item.label }}
          </a>
        </nav>

        <mat-tab-nav-panel #tabPanel>
          <div class="container">
            <ng-content></ng-content>
          </div>
        </mat-tab-nav-panel>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout {
        height: 100%;

        .layout__profile-button {
          margin-left: auto;
        }
      }

      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    `,
  ],
})
export class LayoutComponent {
  private router = inject(Router);

  activeLink$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => {
      console.log((event as NavigationEnd).url);
      return (event as NavigationEnd).url;
    }),
  );

  linksData = [
    { link: '/profile', label: 'Perfil' },
    { link: '/ranking', label: 'Ranking' },
    { link: '/schedule', label: 'Agenda' },
  ];
}

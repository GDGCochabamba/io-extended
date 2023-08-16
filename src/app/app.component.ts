import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutComponent } from './core/layout/layout.component';

@Component({
  selector: 'io-root',
  standalone: true,
  imports: [LayoutComponent, RouterOutlet],
  template: `
    <io-layout>
      <router-outlet></router-outlet>
    </io-layout>
  `,
})
export class AppComponent {
  title = 'io-extended';
}

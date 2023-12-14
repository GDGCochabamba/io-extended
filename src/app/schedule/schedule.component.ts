import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'io-schedule',
  standalone: true,
  imports: [MatExpansionModule],
  template: `
    <iframe
      src="https://drive.google.com/file/d/13t2nRUBoVohyc47uXZncu7yuTBxROcnL/preview"
      title="Cronograma DevFest 2023"
      referrerpolicy="no-referrer"
      width="100%"
      class="schedule__pdf-viewer"
    ></iframe>
  `,
  styles: [
    `
      .schedule__pdf-viewer {
        height: 83vh;
      }
    `,
  ],
})
export default class ScheduleComponent {}

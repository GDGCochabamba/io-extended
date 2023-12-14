import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'io-schedule',
  standalone: true,
  imports: [MatExpansionModule],
  template: `
    <iframe
      src="https://drive.google.com/file/d/16_HsxhjMKXkJ8U2o1sUGiWQidTdimgod/preview"
      title="Cronograma DevFest 2023"
      referrerpolicy="no-referrer"
      width="100%"
      style="height: 83vh"
    ></iframe>
  `,
})
export default class ScheduleComponent {}

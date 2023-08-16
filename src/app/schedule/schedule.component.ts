import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'io-schedule',
  standalone: true,
  imports: [MatExpansionModule],
  template: `
    <mat-accordion>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Title </mat-panel-title>
          <mat-panel-description>
            This is a summary of the content
          </mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel.</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Title </mat-panel-title>
          <mat-panel-description>
            This is a summary of the content
          </mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel.</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Title </mat-panel-title>
          <mat-panel-description>
            This is a summary of the content
          </mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel.</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Title </mat-panel-title>
          <mat-panel-description>
            This is a summary of the content
          </mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel.</p>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> Title </mat-panel-title>
          <mat-panel-description>
            This is a summary of the content
          </mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel.</p>
      </mat-expansion-panel>
    </mat-accordion>
  `,
})
export default class ScheduleComponent {}

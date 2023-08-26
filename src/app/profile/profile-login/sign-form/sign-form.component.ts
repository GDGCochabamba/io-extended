import { Component, EventEmitter, Output, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoadingState } from '../../../core/states/loading.state';

@Component({
  selector: 'io-sign-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card>
      <img
        mat-card-image
        src="assets/img/io-banner.jpg"
        alt="Banner del I/O extended"
      />
      <mat-card-content>
        <form class="sign-form" [formGroup]="signForm" (ngSubmit)="submit()">
          <mat-form-field>
            <mat-label> Correo Electrónico </mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="signForm.invalid || loading()"
          >
            <ng-content select="[submitLabel]"></ng-content>
          </button>
        </form>

        <div class="sign-form__extra">
          <div class="sign-form__or-container">
            <span> O </span>
          </div>

          <button
            mat-raised-button
            color="warn"
            (click)="signInWithGoogle.emit()"
          >
            Continuar con Google
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .sign-form,
      .sign-form__extra {
        display: flex;
        flex-direction: column;
      }

      .sign-form__or-container {
        margin: 22px 0;
        text-align: center;

        span {
          display: inline-block;
          width: 2rem;
        }

        &::before,
        &::after {
          border-bottom: 1px solid #c2c8d0;
          content: '';
          display: inline-block;
          transform: translateY(-0.3rem);
          width: calc(50% - 1rem);
        }
      }
    `,
  ],
})
export class SignFormComponent {
  loading = inject(LoadingState).loading;

  signForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  @Output() signInWithGoogle = new EventEmitter<void>();

  @Output() private submitForm = new EventEmitter<string>();

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.signForm.disable();
      } else {
        this.signForm.enable();
      }
    });
  }

  submit(): void {
    if (this.signForm.invalid) {
      return;
    }

    const { email } = this.signForm.value;

    if (email) {
      this.submitForm.emit(email);
    }
  }
}

import { Component, Input } from '@angular/core';

/** Rótulo, ajuda e erro em volta de um campo com a classe `.control`. */
@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="field">
      <label class="field__label" [attr.for]="controlId || null">
        {{ label }}
        @if (required) {
          <span class="field__required" aria-hidden="true">*</span>
        }
      </label>
      <ng-content></ng-content>
      @if (error) {
        <p class="field__error" role="alert">{{ error }}</p>
      } @else if (hint) {
        <p class="field__hint">{{ hint }}</p>
      }
    </div>
  `,
  styles: `
    .field {
      display: grid;
      gap: var(--space-2);
    }

    .field__label {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-default);
    }

    .field__required {
      color: var(--color-danger-strong);
    }

    .field__hint,
    .field__error {
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--color-text-muted);
    }

    .field__error {
      color: var(--color-danger-strong);
    }
  `,
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  /** `id` do campo; sem ele o rótulo descreve um grupo de campos. */
  @Input() controlId = '';
  @Input() required = false;
  @Input() hint = '';
  @Input() error = '';
}

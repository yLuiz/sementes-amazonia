import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  standalone: true,
  template: `
    <div class="stat">
      <div class="stat__icon"><img [src]="icon" alt="" width="28" height="28" /></div>
      <strong class="stat__value">{{ value }}</strong>
      <p class="stat__label">{{ label }}</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .stat {
      display: grid;
      justify-items: center;
      align-content: start;
      gap: var(--space-3);
      height: 100%;
      padding: var(--space-8) var(--space-4);
      border-radius: var(--radius-card);
      background-color: var(--color-surface-card);
      box-shadow: var(--shadow-md);
      text-align: center;
    }

    .stat__icon {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--color-accent-gold);
    }

    .stat__value {
      font-family: var(--font-display);
      font-size: var(--text-h2);
      font-weight: 700;
      line-height: 1.1;
      color: var(--color-text-earth);
    }

    .stat__label {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }
  `,
})
export class StatComponent {
  @Input({ required: true }) value = '';
  @Input({ required: true }) label = '';
  @Input({ required: true }) icon = '';
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge--' + variant"><ng-content></ng-content></span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 2px var(--space-3);
      border-radius: var(--radius-pill);
      font-size: var(--text-xs);
      font-weight: 600;
      line-height: 1.3;
    }

    .badge--neutral {
      background-color: var(--color-surface-moss);
      color: var(--color-text-default);
    }

    .badge--brand {
      background-color: var(--color-brand-100);
      color: var(--color-brand-700);
    }

    .badge--gold {
      background-color: var(--color-accent-gold);
      color: var(--color-text-default);
    }

    .badge--inverse {
      border: 1px solid var(--glass-border);
      background-color: var(--glass-bg);
      color: var(--color-text-inverse);
    }
  `,
})
export class BadgeComponent {
  @Input() variant: 'neutral' | 'brand' | 'gold' | 'inverse' = 'neutral';
}

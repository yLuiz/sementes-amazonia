import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <div class="empty__icon"><i [class]="'pi ' + icon" aria-hidden="true"></i></div>
      <h2 class="empty__title">{{ title }}</h2>
      @if (text) {
        <p class="empty__text">{{ text }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .empty {
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      padding: var(--space-16) var(--space-4);
      text-align: center;
    }

    .empty__icon {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--color-surface-moss);
      font-size: var(--text-lg);
      color: var(--color-brand-700);
    }

    .empty__title {
      font-size: var(--text-h3);
    }

    .empty__text {
      max-width: 48ch;
      color: var(--color-text-muted);
    }
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'pi-search';
  @Input({ required: true }) title = '';
  @Input() text = '';
}

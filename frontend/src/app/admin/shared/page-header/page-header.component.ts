import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

/** Cabeçalho das telas do painel: caminho, título e ação principal à direita. */
@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <div class="page-header__text">
        @if (breadcrumb.length) {
          <nav aria-label="Você está em">
            <ol class="page-header__breadcrumb">
              @for (item of breadcrumb; track item.label) {
                <li>
                  @if (item.link) {
                    <a [routerLink]="item.link">{{ item.label }}</a>
                  } @else {
                    <span aria-current="page">{{ item.label }}</span>
                  }
                </li>
              }
            </ol>
          </nav>
        }
        <h1>{{ title }}</h1>
      </div>
      <ng-content></ng-content>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .page-header__text {
      display: grid;
      gap: var(--space-1);
    }

    .page-header__breadcrumb {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--color-text-muted);

      li:not(:last-child)::after {
        content: '/';
        margin-left: var(--space-2);
      }

      a:hover {
        text-decoration: underline;
      }
    }
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() breadcrumb: BreadcrumbItem[] = [];
}

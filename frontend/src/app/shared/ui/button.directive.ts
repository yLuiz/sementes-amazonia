import { Directive, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'inverse' | 'glass' | 'danger';

/** Aplica o botão padrão do site (estilos em styles/_ui.scss). */
@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    class: 'btn',
    '[class.btn--primary]': "variant === 'primary'",
    '[class.btn--secondary]': "variant === 'secondary'",
    '[class.btn--outline]': "variant === 'outline'",
    '[class.btn--inverse]': "variant === 'inverse'",
    '[class.btn--glass]': "variant === 'glass'",
    '[class.btn--danger]': "variant === 'danger'",
    '[class.btn--sm]': "size === 'sm'",
    '[class.is-loading]': 'loading',
    '[attr.aria-busy]': 'loading ? true : null',
  },
})
export class ButtonDirective {
  @Input('appButton') set appButton(value: ButtonVariant | '') {
    this.variant = value || 'primary';
  }
  @Input() size: 'sm' | 'md' = 'md';
  @Input() loading = false;

  variant: ButtonVariant = 'primary';
}

import { Component, ContentChild, ElementRef } from '@angular/core';

/** Envolve um campo de senha (`<input #passwordInput>`) com o botão de mostrar e ocultar. */
@Component({
  selector: 'app-password-reveal',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <button
      class="password-toggle"
      type="button"
      [attr.aria-label]="visible ? 'Ocultar senha' : 'Mostrar senha'"
      (click)="toggle()">
      <i class="pi" [class.pi-eye]="!visible" [class.pi-eye-slash]="visible" aria-hidden="true"></i>
    </button>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
    }

    .password-toggle {
      position: absolute;
      top: 2px;
      right: 2px;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      color: var(--color-text-muted);

      &:hover {
        color: var(--color-brand-700);
      }
    }
  `,
})
export class PasswordRevealComponent {
  @ContentChild('passwordInput') private input?: ElementRef<HTMLInputElement>;

  visible = false;

  toggle(): void {
    this.visible = !this.visible;
    if (this.input) {
      this.input.nativeElement.type = this.visible ? 'text' : 'password';
    }
  }
}

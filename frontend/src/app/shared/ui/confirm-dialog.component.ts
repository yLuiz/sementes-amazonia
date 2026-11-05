import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ButtonDirective } from './button.directive';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements AfterViewInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() detail = '';
  @Input() warning = 'Esta ação não pode ser desfeita.';
  @Input() confirmLabel = 'Excluir';
  @Input() loading = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('cancelButton') private cancelButton!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    // O foco começa em "Cancelar", a opção segura em uma ação destrutiva.
    this.cancelButton.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.loading) this.cancelled.emit();
  }
}

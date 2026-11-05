import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { ImgFallbackDirective } from './img-fallback.directive';

/** Seleção de imagem com prévia em 16:9, nome do arquivo e botão de remover. */
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [ImgFallbackDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() previewUrl: string | null = null;
  @Input() fileName = '';
  @Input() accept = 'image/jpeg,image/png,image/webp';
  @Input() hint = '';
  @Output() fileSelected = new EventEmitter<File>();
  @Output() removed = new EventEmitter<void>();

  @ViewChild('input') private input!: ElementRef<HTMLInputElement>;

  onChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.fileSelected.emit(file);
  }

  remove(): void {
    this.reset();
    this.removed.emit();
  }

  /** Limpa o campo, para que o mesmo arquivo possa ser escolhido de novo. */
  reset(): void {
    if (this.input) this.input.nativeElement.value = '';
  }
}

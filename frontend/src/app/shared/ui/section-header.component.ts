import { Component, Input } from '@angular/core';

/** Abertura de seção: etiqueta e título à esquerda, descrição à direita. */
@Component({
  selector: 'app-section-header',
  standalone: true,
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  @Input() eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() align: 'start' | 'center' = 'start';
  @Input() tone: 'default' | 'inverse' = 'default';
  /** Use `h1` só quando este cabeçalho for o título da página. */
  @Input() level: 'h1' | 'h2' = 'h2';
}

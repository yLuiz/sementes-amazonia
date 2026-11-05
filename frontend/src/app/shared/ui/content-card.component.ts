import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { formatShortDate } from '../utils/format-date';
import { mediaUrl } from '../utils/media-url';
import { parseTags } from '../utils/parse-tags';
import { BadgeComponent } from './badge.component';
import { ImgFallbackDirective } from './img-fallback.directive';

export type ContentType = 'news' | 'project';

export interface ContentCardItem {
  id: number;
  title: string;
  summary: string;
  image_thumb?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  tags?: string | null;
}

/** Card de notícia ou projeto: a foto é protagonista e o card inteiro é um link. */
@Component({
  selector: 'app-content-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink, BadgeComponent, ImgFallbackDirective],
  templateUrl: './content-card.component.html',
  styleUrl: './content-card.component.scss',
})
export class ContentCardComponent {
  @Input({ required: true }) type: ContentType = 'news';
  /** Só para os cards no topo da página, que devem carregar antes dos demais. */
  @Input() priority = false;
  @Input({ required: true }) set item(value: ContentCardItem) {
    this.content = value;
    this.image = mediaUrl(value.image_thumb) ?? 'assets/logo.svg';
    this.hasImage = !!value.image_thumb;
    this.date = formatShortDate(value.published_at || value.created_at);
    this.tags = parseTags(value.tags).slice(0, 3);
  }

  content!: ContentCardItem;
  image = '';
  hasImage = false;
  date = '';
  tags: string[] = [];

  get linkLabel(): string {
    return this.type === 'news' ? 'Leia mais' : 'Veja mais';
  }

  get categoryLabel(): string {
    return this.type === 'news' ? 'Notícia' : 'Projeto';
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news/news.service';
import { SITE_CONTENT } from '../../../shared/content/site-content';
import { BadgeComponent } from '../../../shared/ui/badge.component';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ImgFallbackDirective } from '../../../shared/ui/img-fallback.directive';
import { mediaUrl } from '../../../shared/utils/media-url';
import { parseTags } from '../../../shared/utils/parse-tags';

interface HeroItem {
  key: string;
  id?: number;
  image: string;
  tags: string[];
  title: string;
  text: string;
}

const AUTOPLAY_MS = 10000;
const FALLBACK_IMAGE = 'assets/photos/hero-forest.webp';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BadgeComponent, ButtonDirective, ImgFallbackDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly fallbackImage = FALLBACK_IMAGE;
  readonly highlights = SITE_CONTENT.heroHighlights;

  /** Mostrado até a API responder, e também se ela falhar ou vier vazia. */
  items: HeroItem[] = [
    {
      key: 'default',
      image: FALLBACK_IMAGE,
      tags: ['Sementes da Amazônia'],
      title: 'Protegendo nosso meio ambiente para gerações futuras',
      text: SITE_CONTENT.about,
    },
  ];
  currentIndex = 0;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly newsService = inject(NewsService);
  private readonly zone = inject(NgZone);
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private timer: ReturnType<typeof setInterval> | null = null;

  get current(): HeroItem | undefined {
    return this.items[this.currentIndex];
  }

  ngOnInit(): void {
    this.newsService.getNews({ limit: 3, orderBy: 'id', direction: 'DESC' }).subscribe({
      next: (news) => {
        if (!news.data.length) return;
        this.items = news.data.map((item) => {
          const tags = parseTags(item.tags);
          return {
            key: `news-${item.id}`,
            id: item.id,
            image: mediaUrl(item.image_thumb) ?? FALLBACK_IMAGE,
            tags: tags.length ? tags.slice(0, 3) : ['Notícia'],
            title: item.title,
            text: item.summary,
          };
        });
        this.currentIndex = 0;
        this.cdr.markForCheck();
      },
      error: (error) => console.error('Erro ao carregar notícias para o carrossel:', error),
    });
    this.resume();
  }

  ngOnDestroy(): void {
    this.pause();
  }

  pause(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  resume(): void {
    if (this.reducedMotion || this.timer) return;
    // O relógio fica fora da zona: a cada volta a aplicação inteira não é verificada.
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => this.zone.run(() => this.next()), AUTOPLAY_MS);
    });
  }

  previous(): void {
    this.goTo((this.currentIndex - 1 + this.items.length) % this.items.length);
  }

  next(): void {
    this.goTo((this.currentIndex + 1) % this.items.length);
  }

  goTo(index: number): void {
    this.currentIndex = index;
    // O relógio do carrossel chega aqui sem nenhum evento da tela.
    this.cdr.markForCheck();
  }
}

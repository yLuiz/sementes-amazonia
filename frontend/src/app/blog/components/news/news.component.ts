import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INews, NewsService } from '../../../services/news/news.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ContentCardComponent } from '../../../shared/ui/content-card.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';

@Component({
  selector: 'app-news',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, ContentCardComponent, EmptyStateComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  readonly placeholders = [1, 2, 3];

  newsList: INews[] = [];
  status: 'loading' | 'ready' | 'error' = 'loading';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly newsService = inject(NewsService);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status = 'loading';
    this.newsService.getNews({ limit: 3 }).subscribe({
      next: (news) => {
        this.newsList = news.data;
        this.status = 'ready';
        this.cdr.markForCheck();
      },
      error: () => {
        this.status = 'error';
        this.cdr.markForCheck();
      },
    });
  }
}

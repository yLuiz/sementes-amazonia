import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INews, NewsService } from '../../../services/news/news.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ContentCardComponent } from '../../../shared/ui/content-card.component';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink, ButtonDirective, ContentCardComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  newsList: INews[] = [];

  private readonly newsService = inject(NewsService);

  ngOnInit(): void {
    this.newsService.getNews({ limit: 3 }).subscribe({
      next: (news) => (this.newsList = news.data),
      error: (error) => console.error('Erro ao carregar notícias:', error),
    });
  }
}

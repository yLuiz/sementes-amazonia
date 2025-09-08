import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsService, INews } from '../../../services/news/news.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    NewsCardComponent
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit, OnDestroy {
  newsList: INews[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private newsService: NewsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carrega as notícias
   */
  private loadNews(): void {
    const newsSub = this.newsService.getNews({
      limit: 3,
    }).subscribe({
      next: (news) => {
        this.newsList = news.data;
      },
      error: (error) => {
        console.error('Erro ao carregar notícias:', error);
      }
    });

    this.subscription.add(newsSub);
  }

  /**
   * Navega para a página de todas as notícias
   */
  onViewAllNews(): void {
    this.router.navigate(['/list-all'], {
      queryParams: { type: 'news' }
    });
  }
}
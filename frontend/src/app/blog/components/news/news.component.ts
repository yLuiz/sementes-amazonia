import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsService, INewsPortugueseResponse, News } from '../../../services/news/news.service';
import { Subscription } from 'rxjs';

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
  newsInPortuguese: INewsPortugueseResponse[] = [];
  newsList: News[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private newsService: NewsService) { }

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
    console.log('Carregando notícias...');
    const newsSub = this.newsService.getNews().subscribe({
      next: (news) => {
        console.log('Notícias carregadas:', news);
        // Se sua API retorna { data: [...] }
        this.newsInPortuguese = (news as any).data as INewsPortugueseResponse[] || [];
        // Se quiser usar o mock ou News padrão:
        // this.newsList = news as News[];
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
    // TODO: Implementar navegação para página de notícias
    console.log('Navegar para todas as notícias');
  }
}
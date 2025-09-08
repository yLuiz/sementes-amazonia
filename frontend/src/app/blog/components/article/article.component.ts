import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarouselModule } from 'primeng/carousel';
import { Carousel } from 'primeng/carousel';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { INews, NewsService } from '../../../services/news/news.service';
import { ProjectArticleComponent } from './project-article/project-article.component';
import { NewsArticleComponent } from './news-article/news-article.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NavbarComponent,
    CarouselModule,
    ProjectArticleComponent,
    NewsArticleComponent
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {

  @ViewChild('imageCarousel') imageCarousel!: Carousel;

  currentImageIndex: number = 0;

  images = [
    {
      src: 'assets/amazon_forest.png',
      alt: 'Floresta Amazônica'
    },
    {
      src: 'assets/amazon_forest_2.png',
      alt: 'Biodiversidade da Amazônia'
    },
    {
      src: 'assets/Image 1.png',
      alt: 'Pesquisa na Amazônia'
    }
  ];

  news: INews | null = null;
  project: IProject | null = null;

  articleId: number | null = null;

  formattedDate: string = '';
  type: 'news' | 'project' = 'news';

  constructor(
    private _route: ActivatedRoute,
    private readonly _projectsService: ProjectsService,
    private readonly _newsService: NewsService
  ) { }

  ngOnInit() {
    // Captura o ID da URL
    this.articleId = Number(this._route.snapshot.paramMap.get('id')) || null;

    this._route.queryParamMap.subscribe(params => {
      const typeParam = params.get('type');

      if (typeParam === 'news' || typeParam === 'project') {
        this.type = typeParam;
      }

      this.getInfoByType({
        type: this.type,
        id: this.articleId
      });
    });
  }

  getInfoByType(args: {
    type: 'news' | 'project',
    id: number | null
  }) {
    if (args.type === 'news' && args.id) {
      this._newsService.getNewsById(args.id).subscribe({
        next: (news) => {
          this.news = news;
          // Formata a data em português brasileiro
          this.formattedDate = this.formatDateToPtBr(new Date(news.published_at));
        },
        error: (err) => {
          console.error('Erro ao carregar notícia:', err);
        }
      });
      return;
    }

    if (args.type === 'project' && args.id) {
      this._projectsService.getProjectById(args.id).subscribe({
        next: (project) => {
          this.project = project;
          // Formata a data em português brasileiro
          this.formattedDate = this.formatDateToPtBr(new Date(project.created_at));
        },
        error: (err) => {
          console.error('Erro ao carregar projeto:', err);
        }
      });
      return;
    }

    console.warn('Tipo ou ID inválido para carregar informações.');
  }

  formatDateToPtBr(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  }
}

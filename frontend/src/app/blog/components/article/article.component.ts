import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { INews, NewsService } from '../../../services/news/news.service';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { ImgFallbackDirective } from '../../../shared/ui/img-fallback.directive';
import { formatLongDate } from '../../../shared/utils/format-date';
import { mediaUrl } from '../../../shared/utils/media-url';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { contentToParagraphs } from './content-to-paragraphs';

type ArticleContent = INews | IProject;

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, ButtonDirective, EmptyStateComponent, FooterComponent, ImgFallbackDirective, NavbarComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, OnDestroy {
  status: 'loading' | 'ready' | 'notFound' = 'loading';
  type: 'news' | 'project' = 'news';
  content: ArticleContent | null = null;
  coverImage: string | null = null;
  formattedDate = '';
  paragraphs: string[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly newsService = inject(NewsService);
  private readonly projectsService = inject(ProjectsService);
  private readonly toastr = inject(ToastrService);
  private routeSubscription?: Subscription;
  private request?: Subscription;

  get typeLabel(): string {
    return this.type === 'news' ? 'Notícias' : 'Projetos';
  }

  get listingType(): 'news' | 'projects' {
    return this.type === 'news' ? 'news' : 'projects';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      this.type = params.get('type') === 'project' ? 'project' : 'news';

      if (!id) {
        this.status = 'notFound';
        return;
      }

      const source: Observable<ArticleContent> =
        this.type === 'news' ? this.newsService.getNewsById(id) : this.projectsService.getProjectById(id);

      this.status = 'loading';
      this.request?.unsubscribe();
      this.request = source.subscribe({
        next: (content) => {
          this.content = content;
          this.coverImage = mediaUrl(content.image_thumb);
          this.formattedDate = formatLongDate(content.published_at || content.created_at);
          this.paragraphs = contentToParagraphs(content.content);
          this.status = 'ready';
        },
        error: (error) => {
          console.error('Erro ao carregar o conteúdo:', error);
          this.status = 'notFound';
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.request?.unsubscribe();
  }

  share(): void {
    const url = window.location.href;
    navigator.clipboard
      ?.writeText(url)
      .then(() => this.toastr.success('Link copiado para a área de transferência!'))
      .catch(() => this.toastr.error(`Não foi possível copiar. Copie o endereço manualmente: ${url}`));
  }
}

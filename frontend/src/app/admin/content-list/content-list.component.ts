import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { NewsService } from '../../services/news/news.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { ConfirmDialogComponent } from '../../shared/ui/confirm-dialog.component';
import { ContentCardItem, ContentType } from '../../shared/ui/content-card.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { ImgFallbackDirective } from '../../shared/ui/img-fallback.directive';
import { PtBrPaginatorIntl } from '../../shared/ui/paginator-intl';
import { formatShortDate } from '../../shared/utils/format-date';
import { mediaUrl } from '../../shared/utils/media-url';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { CONTENT_LABELS } from '../shared/content-labels';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 3;

/** Tabela de notícias ou de projetos; o tipo vem do `data` da rota. */
@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginatorModule,
    RouterLink,
    TableModule,
    ButtonDirective,
    ConfirmDialogComponent,
    EmptyStateComponent,
    ImgFallbackDirective,
    PageHeaderComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PtBrPaginatorIntl }],
  templateUrl: './content-list.component.html',
  styleUrl: './content-list.component.scss',
})
export class ContentListComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [10, 20, 30, 40];

  type: ContentType = inject(ActivatedRoute).snapshot.data['type'];
  labels = CONTENT_LABELS[this.type];
  basePath = this.type === 'news' ? '/admin/news' : '/admin/projects';

  items: ContentCardItem[] = [];
  totalItems = 0;
  currentPage = 0;
  pageSize = 10;
  searchTerm = '';
  isLoading = true;
  isDeleting = false;
  itemToDelete: ContentCardItem | null = null;

  private readonly newsService = inject(NewsService);
  private readonly projectsService = inject(ProjectsService);
  private readonly toastr = inject(ToastrService);
  private request?: Subscription;
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
  }

  imageOf(item: ContentCardItem): string | null {
    return mediaUrl(item.image_thumb);
  }

  dateOf(item: ContentCardItem): string {
    return formatShortDate(item.published_at || item.created_at);
  }

  onSearchChange(): void {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      if (this.searchTerm.length === 0 || this.searchTerm.length >= MIN_SEARCH_LENGTH) {
        this.currentPage = 0;
        this.load();
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;

    const id = this.itemToDelete.id;
    const source = this.type === 'news' ? this.newsService.deleteNews(id) : this.projectsService.deleteProject(id);

    this.isDeleting = true;
    source.subscribe({
      next: () => {
        this.toastr.success(this.labels.deleted, 'Sucesso.');
        this.itemToDelete = null;
        this.isDeleting = false;
        // Ao apagar o último item de uma página, volta para a anterior.
        if (this.items.length === 1 && this.currentPage > 0) this.currentPage--;
        this.load();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Não foi possível concluir a exclusão.', 'Falha.');
        this.itemToDelete = null;
        this.isDeleting = false;
      },
    });
  }

  private load(): void {
    const filters = { page: this.currentPage + 1, limit: this.pageSize, title: this.searchTerm };
    const source =
      this.type === 'news' ? this.newsService.getNews(filters) : this.projectsService.getProjects(filters);

    this.isLoading = true;
    this.request?.unsubscribe();
    this.request = source.subscribe({
      next: (response) => {
        this.items = response.data;
        this.totalItems = response.meta.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Não foi possível carregar a lista.', 'Falha.');
        this.items = [];
        this.totalItems = 0;
        this.isLoading = false;
      },
    });
  }
}

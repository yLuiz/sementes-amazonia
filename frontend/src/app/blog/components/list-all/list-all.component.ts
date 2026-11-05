import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NewsService } from '../../../services/news/news.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { IPageResponse } from '../../../shared/interfaces/IPageResponse';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ContentCardComponent, ContentCardItem } from '../../../shared/ui/content-card.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { PtBrPaginatorIntl } from '../../../shared/ui/paginator-intl';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

type ListingFilter = 'news' | 'projects';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 3;

@Component({
  selector: 'app-list-all',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatPaginatorModule,
    ButtonDirective,
    ContentCardComponent,
    EmptyStateComponent,
    FooterComponent,
    NavbarComponent,
    RevealDirective,
    SectionHeaderComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PtBrPaginatorIntl }],
  templateUrl: './list-all.component.html',
  styleUrl: './list-all.component.scss',
})
export class ListAllComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [12, 24, 36];
  readonly placeholders = [1, 2, 3, 4, 5, 6];

  searchTerm = '';
  selectedFilter: ListingFilter = 'news';
  items: ContentCardItem[] = [];
  totalItems = 0;
  currentPage = 0;
  pageSize = 12;
  isLoading = true;
  hasError = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly projectsService = inject(ProjectsService);
  private routeSubscription?: Subscription;
  private request?: Subscription;
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      // `project` é aceito porque links antigos usam o singular.
      this.selectedFilter = params['type'] === 'projects' || params['type'] === 'project' ? 'projects' : 'news';
      this.currentPage = 0;
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.request?.unsubscribe();
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
  }

  onFilterChange(filter: ListingFilter): void {
    this.router.navigate([], { queryParams: { type: filter } });
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

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  load(): void {
    const filters = { page: this.currentPage + 1, limit: this.pageSize, title: this.searchTerm };
    const source: Observable<IPageResponse<ContentCardItem[]>> =
      this.selectedFilter === 'news' ? this.newsService.getNews(filters) : this.projectsService.getProjects(filters);

    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();
    // Cancela a busca anterior: uma resposta atrasada não pode sobrescrever a atual.
    this.request?.unsubscribe();
    this.request = source.subscribe({
      next: (response) => {
        this.items = response.data;
        this.totalItems = response.meta.total;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.items = [];
        this.totalItems = 0;
        this.isLoading = false;
        this.hasError = true;
        this.cdr.markForCheck();
      },
    });
  }
}

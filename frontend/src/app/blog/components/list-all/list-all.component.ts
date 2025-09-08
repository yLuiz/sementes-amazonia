import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { INewsFilters, INews, NewsService } from '../../../services/news/news.service';
import { IProjectsFilters, IProject, ProjectsService } from '../../../services/projects/projects.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ToastrService } from 'ngx-toastr';

export interface IItemToDelete {
  id: number;
  title: string;
}

class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-list-all',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    NewsCardComponent,
    ProjectCardComponent,
    NavbarComponent,
    SidebarComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
  templateUrl: './list-all.component.html',
  styleUrl: './list-all.component.scss'
})
export class ListAllComponent implements OnInit {

  searchTerm: string = '';
  selectedFilter: 'news' | 'projects' = 'news';
  isAdminContext: boolean = false;

  totalItems: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40];

  // Propriedades do modal de delete
  showDeleteModal: boolean = false;
  itemToDelete: IItemToDelete | null = null;

  news: INews[] = [];
  projects: IProject[] = [];

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _projectsService: ProjectsService,
    private _newsService: NewsService,
    private _toastr: ToastrService
  ) {
    // Verifica se o usuário está autenticado como admin
    const token = this._authService.getToken();
    this.isAdminContext = token ? this._authService.validateToken(token) : false;
  }


  getNews(filters: INewsFilters) {
    this._newsService.getNews({
      page: filters.page,
      limit: filters.limit,
      title: filters.title
    }).subscribe({
      next: (response) => {
        this.news = response.data;
        this.totalItems = response.meta.total;
      },
      error: (error) => {
        console.error('Erro ao buscar notícias:', error);
      }
    });
  }

  getProjects(filters: IProjectsFilters) {
    this._projectsService.getProjects({
      page: filters.page,
      limit: filters.limit,
      title: filters.title
    }).subscribe({
      next: (response) => {
        this.projects = response.data;
        this.totalItems = response.meta.total;
      },
      error: (error) => {
        console.error('Erro ao buscar projetos:', error);
      }
    });
  }

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      if (params['type']) {
        const type = params['type'];
        if (type === 'news' || type === 'projects') {
          this.getItemsByType({ type, page: 1, limit: 10 });
          this.selectedFilter = type;
          this.currentPage = 0;
        }
      }
      else {
        this.selectedFilter = 'news';
        this.currentPage = 0;
        this.getItemsByType({ type: 'news', page: 1, limit: 10 });
      }
    });
  }

  getItemsByType(args: {
    type: 'news' | 'projects',
    page: number,
    limit: number,
    title?: string
  }) {
    if (args.type === 'news') {
      this.getNews({
        page: args.page,
        limit: args.limit,
        title: this.searchTerm
      });
    }
    else if (args.type === 'projects') {
      this.getProjects({
        page: args.page,
        limit: args.limit,
        title: this.searchTerm
      });
    }
  }

  onFilterChange(filter: 'news' | 'projects') {
    this.getItemsByType({
      type: filter,
      page: 1,
      limit: 10,
      title: this.searchTerm
    })
    this.selectedFilter = filter;
    this.currentPage = 0;
  }

  private searchDebounce: NodeJS.Timeout | null = null;
  onSearchChange() {
    // limpa o timer anterior se o usuário digitar de novo
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }

    const SECONDS_TO_WAIT = 0.5 * 1000;
    // espera 0.5 segundos depois da última tecla
    this.searchDebounce = setTimeout(() => {
      if (this.searchTerm.length === 0 || this.searchTerm.length > 2) {
        this.getItemsByType({
          type: this.selectedFilter,
          page: 1,
          limit: 10,
          title: this.searchTerm
        });
      }

      this.currentPage = 0;
    }, SECONDS_TO_WAIT); // 1s
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 0;
    this.getItemsByType({
      type: this.selectedFilter,
      page: 1,
      limit: 10
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getItemsByType({
      type: this.selectedFilter,
      page: event.pageIndex + 1,
      limit: event.pageSize
    });
  }

  getPageTitle(): string {
    switch (this.selectedFilter) {
      case 'news':
        return 'Todas as Notícias';
      case 'projects':
        return 'Todos os Projetos';
      default:
        return 'Todas as Notícias e Projetos';
    }
  }

  getPageDescription(): string {
    switch (this.selectedFilter) {
      case 'news':
        return 'Visualize todas as notícias cadastradas no site';
      case 'projects':
        return 'Visualize todos os projetos cadastrados no site';
      default:
        return 'Visualize todos os conteúdos cadastrados no site';
    }
  }

  editProject(item: IProject) {
    this._router.navigate(['/admin/edit', item.id], { queryParams: { type: 'project' } });
  }

  editNews(item: INews) {
    this._router.navigate(['/admin/edit', item.id], { queryParams: { type: 'news' } });

  }

  cancelItemDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmItemDelete(): void { }


  deleteItem(item: IItemToDelete) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.itemToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {

    if (this.selectedFilter === 'news') {
      this._newsService.deleteNews(this.itemToDelete!.id).subscribe({
        next: (response) => {
          this._toastr.success('Notícia removida com sucesso!', 'Sucesso.')
        },
        error: (error) => {
          console.error(error);
          this._toastr.error('Não foi possível concluir a ação.', 'Sucesso.');
        }
      })
      .add(() => {
        this.showDeleteModal = false;
        this.itemToDelete = null;
      })

      return;
    }

    if (this.selectedFilter === 'projects') {
      this._projectsService.deleteProject(this.itemToDelete!.id).subscribe({
        next: (response) => {
          this._toastr.success('Projeto removido com sucesso!', 'Sucesso.');
        },
        error: (error) => {
          console.error(error);
          this._toastr.error('Não foi possível concluir a ação.', 'Sucesso.');
        }
      })
        .add(() => {
          this.showDeleteModal = false;
          this.itemToDelete = null;
        })

      return;

    }

  }
}

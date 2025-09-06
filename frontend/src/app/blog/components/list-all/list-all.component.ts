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
import { INewsFilters, News, NewsService } from '../../../services/news/news.service';
import { Project, ProjectsService } from '../../../services/projects/projects.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ProjectCardComponent } from '../project-card/project-card.component';

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

interface MockItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string;
  type: 'news' | 'project';
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
  selectedFilter: 'all' | 'news' | 'project' = 'all';
  isAdminContext: boolean = false;

  totalItems: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40];

  // Propriedades do modal de delete
  showDeleteModal: boolean = false;
  itemToDelete: News | null = null;

  news: News[] = [];
  projects: Project[] = [];

  constructor(
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private newsService: NewsService
  ) { 
    // Verifica se o usuário está autenticado como admin
    const token = this._authService.getToken();
    this.isAdminContext = token ? this._authService.validateToken(token) : false;
  }


  getNews(filters: INewsFilters) {

    console.log(filters);
    

    this.newsService.getNews({
      page: filters.page,
      limit: filters.limit,
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

  ngOnInit() {

    this.getNews({ page: 1, limit: 10 });

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        const type = params['type'];
        if (type === 'news' || type === 'project') {
          this.selectedFilter = type;
          this.currentPage = 0;
        }
      }
      else {
        this.selectedFilter = 'news';
        this.currentPage = 0;
      }
    });
  }

  onFilterChange(filter: 'all' | 'news' | 'project') {
    this.selectedFilter = filter;
    this.currentPage = 0;
  }

  onSearchChange() {
    this.currentPage = 0;
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 0;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    this.getNews({
      page: event.pageIndex + 1,
      limit: event.pageSize
    });
  }

  getPageTitle(): string {
    switch (this.selectedFilter) {
      case 'news':
        return 'Todas as Notícias';
      case 'project':
        return 'Todos os Projetos';
      default:
        return 'Todas as Notícias e Projetos';
    }
  }

  getPageDescription(): string {
    switch (this.selectedFilter) {
      case 'news':
        return 'Visualize todas as notícias cadastradas no site';
      case 'project':
        return 'Visualize todos os projetos cadastrados no site';
      default:
        return 'Visualize todos os conteúdos cadastrados no site';
    }
  }

  editItem(item: any) {
      // Vai ter que integrar o role do edit aq
    console.log('Editando item:', item);

  }

  deleteItem(item: News) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {    
    this.cancelDelete();  
  }
}

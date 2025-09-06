import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar.component';

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

  currentPage: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40];

  // Propriedades do modal de delete
  showDeleteModal: boolean = false;
  itemToDelete: MockItem | null = null;

  allItems: MockItem[] = [
    {
      id: 1,
      title: 'Descoberta de Nova Espécie de Orquídea na Amazônia',
      description: 'Pesquisadores descobriram uma nova espécie de orquídea endêmica da região amazônica, destacando a importância da conservação da biodiversidade.',
      date: '2024-08-15',
      type: 'news'
    },
    {
      id: 2,
      title: 'Projeto de Reflorestamento Atinge Meta de 10 Mil Mudas',
      description: 'O projeto de reflorestamento da comunidade local superou a meta inicial, plantando mais de 10 mil mudas nativas da região.',
      date: '2024-08-10',
      type: 'news'
    },
    {
      id: 3,
      title: 'Workshop de Educação Ambiental para Crianças',
      description: 'Evento educativo ensina crianças da região sobre a importância da preservação ambiental e sustentabilidade.',
      date: '2024-08-05',
      type: 'news'
    },
    {
      id: 4,
      title: 'Parceria com Universidades para Pesquisa da Flora',
      description: 'Nova parceria com universidades nacionais visa mapear e catalogar espécies vegetais da Amazônia.',
      date: '2024-07-30',
      type: 'news'
    },
    {
      id: 5,
      title: 'Comunidade Indígena Recebe Certificação Ambiental',
      description: 'Comunidade local recebe certificação por práticas sustentáveis de manejo florestal.',
      date: '2024-07-25',
      type: 'news'
    },
    // Projetos
    {
      id: 6,
      title: 'Sementes do Futuro',
      description: 'Projeto focado na coleta, armazenamento e distribuição de sementes nativas da Amazônia para programas de reflorestamento.',
      date: '2024-01-15',
      type: 'project'
    },
    {
      id: 7,
      title: 'Guardiões da Floresta',
      description: 'Iniciativa que treina comunidades locais para monitoramento e proteção de áreas de conservação.',
      date: '2024-02-20',
      type: 'project'
    },
    {
      id: 8,
      title: 'Biodiversidade Digital',
      description: 'Criação de banco de dados digital para catalogar espécies vegetais e animais da região amazônica.',
      date: '2024-03-10',
      type: 'project'
    },
    {
      id: 9,
      title: 'Educação Verde',
      description: 'Programa educacional que leva conhecimento sobre sustentabilidade para escolas rurais da Amazônia.',
      date: '2024-04-05',
      type: 'project'
    },
    {
      id: 10,
      title: 'Águas Preservadas',
      description: 'Projeto de monitoramento e preservação de recursos hídricos em bacias hidrográficas amazônicas.',
      date: '2024-05-12',
      type: 'project'
    },
    {
      id: 11,
      title: 'Medicina Tradicional',
      description: 'Pesquisa e documentação de plantas medicinais utilizadas por comunidades tradicionais.',
      date: '2024-06-08',
      type: 'project'
    },
    {
      id: 12,
      title: 'Corredores Ecológicos',
      description: 'Criação de corredores que conectam fragmentos florestais para facilitar a migração da fauna.',
      date: '2024-07-15',
      type: 'project'
    },
    {
      id: 13,
      title: 'Monitoramento de Desmatamento',
      description: 'Nova tecnologia de satélite detecta desmatamento em tempo real na região amazônica.',
      date: '2024-08-20',
      type: 'news'
    },
    {
      id: 14,
      title: 'Sementes Nativas',
      description: 'Projeto de coleta e distribuição de sementes de espécies nativas para reflorestamento.',
      date: '2024-03-18',
      type: 'project'
    },
    {
      id: 15,
      title: 'Turismo Sustentável',
      description: 'Iniciativa promove turismo ecológico responsável em comunidades amazônicas.',
      date: '2024-06-25',
      type: 'project'
    },
    {
      id: 16,
      title: 'Descoberta de Nova Espécie de Peixe',
      description: 'Biólogos descobrem nova espécie de peixe endêmica dos rios amazônicos.',
      date: '2024-07-08',
      type: 'news'
    },
    {
      id: 17,
      title: 'Energia Solar Comunitária',
      description: 'Implementação de painéis solares em aldeias remotas da Amazônia.',
      date: '2024-04-12',
      type: 'project'
    },
    {
      id: 18,
      title: 'Festival da Biodiversidade',
      description: 'Evento anual celebra a rica biodiversidade amazônica com exposições e palestras.',
      date: '2024-09-01',
      type: 'news'
    }
  ];

  constructor(
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    // Verifica se o usuário está autenticado como admin
    const token = this._authService.getToken();
    this.isAdminContext = token ? this._authService.validateToken(token) : false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        const type = params['type'];
        if (type === 'news' || type === 'project') {
          this.selectedFilter = type;
          this.currentPage = 0;
        }
      }
    });
  }

  get filteredItems(): MockItem[] {
    let filtered = this.allItems;
    console.log('Total de itens antes do filtro:', filtered.length);
    console.log('Filtro atual:', this.selectedFilter);

    // Filtro por tipo
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.type === this.selectedFilter);
      console.log(`Itens após filtro por tipo '${this.selectedFilter}':`, filtered.length);
      console.log('Primeiros 3 itens filtrados:', filtered.slice(0, 3).map(item => ({title: item.title, type: item.type})));
    }

    // Filtro por busca
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
      console.log(`Itens após filtro de busca '${this.searchTerm}':`, filtered.length);
    }

    return filtered;
  }

  get paginatedItems(): MockItem[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredItems.slice(startIndex, endIndex);
  }

  get totalItems(): number {
    return this.filteredItems.length;
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

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
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

  editItem(item: MockItem) {
      // Vai ter que integrar o role do edit aq
    console.log('Editando item:', item);

  }

  deleteItem(item: MockItem) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      // Vai ter que integrar o role do delete aq
      console.log(`${this.itemToDelete.type === 'news' ? 'Notícia' : 'Projeto'} deletado:`, this.itemToDelete.title);
        if (this.paginatedItems.length === 1 && this.currentPage > 0) {
          this.currentPage--;
      }
    }
    
    this.cancelDelete();
  }
}

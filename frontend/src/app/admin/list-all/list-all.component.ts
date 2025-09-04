import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NewsCardComponent } from '../../blog/components/news-card/news-card.component';
import { ProjectCardComponent } from '../../blog/components/project-card/project-card.component';

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
    FormsModule,
    ButtonModule,
    TooltipModule,
    NewsCardComponent,
    ProjectCardComponent
  ],
  templateUrl: './list-all.component.html',
  styleUrl: './list-all.component.scss'
})
export class ListAllComponent {

  searchTerm: string = '';
  selectedFilter: 'all' | 'news' | 'project' = 'all';

  allItems: MockItem[] = [
    // Notícias
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
    }
  ];

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  get filteredItems(): MockItem[] {
    let filtered = this.allItems;

    // Filtro por tipo
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.type === this.selectedFilter);
    }

    // Filtro por busca
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  onFilterChange(filter: 'all' | 'news' | 'project') {
    this.selectedFilter = filter;
  }

  onSearchChange() {
    // A filtragem acontece automaticamente através do getter filteredItems
  }

  clearSearch() {
    this.searchTerm = '';
  }

  goToWebSite() {
    this.router.navigate(['']);
  }

  logout() {
    this._authService.logout();
    this.router.navigate(['/admin/login'])
  }

  editItem(item: MockItem) {
    console.log('Editando item:', item);
    // Aqui você pode adicionar a lógica para editar o item
    // Por exemplo: navegar para uma página de edição
    // this.router.navigate(['/admin/edit', item.type, item.id]);
  }

  deleteItem(item: MockItem) {
    console.log('Deletando item:', item);
    // Aqui você pode adicionar a lógica para deletar o item
    // Por exemplo: mostrar um modal de confirmação
    if (confirm(`Tem certeza que deseja deletar "${item.title}"?`)) {
      const index = this.allItems.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.allItems.splice(index, 1);
      }
    }
  }
}

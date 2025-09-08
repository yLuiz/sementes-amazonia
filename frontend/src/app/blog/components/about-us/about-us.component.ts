import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';

interface TeamMember {
  name: string;
  position: string;
  description: string;
  avatar?: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    NavbarComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

  teamMembers: TeamMember[] = [
    {
      name: 'Dr. Maria Silva',
      position: 'Diretora de Ecologia',
      description: 'Especialista em biodiversidade amazônica com mais de 20 anos de experiência em conservação e pesquisa de espécies nativas.'
    },
    {
      name: 'Prof. João Santos',
      position: 'Líder de Pesquisa Ambiental',
      description: 'Botânico renomado, responsável pela catalogação de espécies vegetais e desenvolvimento de programas de reflorestamento.'
    },
    {
      name: 'Ana Rodrigues',
      position: 'Coordenadora de Extensão',
      description: 'Responsável pelo engajamento comunitário e programas educacionais nas comunidades locais da Amazônia.'
    },
    {
      name: 'Carlos Oliveira',
      position: 'Gestor de Projetos',
      description: 'Especialista em captação de recursos e gestão de projetos sustentáveis, com foco em parcerias internacionais.'
    }
  ];

  timeline: TimelineEvent[] = [
    {
      year: '2005',
      title: 'Fundação',
      description: 'Criação da organização com foco na preservação da biodiversidade amazônica e desenvolvimento sustentável.'
    },
    {
      year: '2010',
      title: 'Primeiro Grande Projeto',
      description: 'Lançamento do programa "Sementes do Futuro" para coleta e distribuição de sementes nativas.'
    },
    {
      year: '2015',
      title: 'Expansão',
      description: 'Ampliação das atividades para 5 estados da região amazônica, alcançando mais de 50 comunidades.'
    },
    {
      year: '2020',
      title: 'Inovação',
      description: 'Implementação de tecnologias digitais para monitoramento da biodiversidade e educação ambiental.'
    },
    {
      year: '2025',
      title: 'Presente',
      description: 'Mais de 10 mil mudas plantadas e 100 espécies catalogadas, com impacto positivo em toda a região.'
    }
  ];

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

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
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

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

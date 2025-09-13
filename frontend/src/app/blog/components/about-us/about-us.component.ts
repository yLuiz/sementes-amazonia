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
      year: '2021',
      title: 'Fundação da Associação',
      description: 'Criação da Associação com o objetivo de estabelecer um elo legal e institucional entre os coletores de sementes florestais do Amazonas e as iniciativas de restauração ecológica.'
    },
    {
      year: '2021',
      title: 'Origem no CSNAM',
      description: 'A ideia nasceu das experiências do Centro de Sementes Nativas do Amazonas (CSNAM), laboratório da UFAM, identificando a necessidade de articulação na cadeia do restauro.'
    },
    {
      year: '2021',
      title: 'Liderança Acadêmica',
      description: 'Professor Dr. Manuel de Jesus Vieira Lima Junior, da UFAM e coordenador do CSNAM, lidera a criação com propósito de integrar agentes da restauração ecológica.'
    },
    {
      year: '2021-2022',
      title: 'Primeiras Ações',
      description: 'Lançamento do curso de Manejo e Coleta de Sementes no Dossel, tornando-se referência na formação de coletores capacitados.'
    },
    {
      year: '2022-2025',
      title: 'Expansão e Consolidação',
      description: 'Com equipe comprometida, a Associação expandiu suas frentes de atuação, consolidando-se como organização referência na cadeia do restauro.'
    }
  ];

}

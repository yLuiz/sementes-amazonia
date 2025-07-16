import { Component } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  projects: {
    image: string,
    title: string,
    date: string,
    description: string,
  }[] = [
      {
        image: '../../../assets/Image 1.png',
        title: 'Projeto 1',
        date: '31 de Maio de 2025',
        description: 'Descrição do Projeto 1. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
      },
      {
        image: '../../../assets/Image 2.png',
        title: 'Projeto 2',
        date: '31 de Maio de 2025',
        description: 'Descrição do Projeto 2. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
      },
      {
        image: '../../../assets/Image 3.png',
        title: 'Projeto 3',
        date: '31 de Maio de 2025',
        description: 'Descrição do Projeto 3. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
      }
    ]

}

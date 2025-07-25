import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectsService, Project, IProjectPortugueseResponse } from '../../../services/projects/projects.service';
import { Subscription } from 'rxjs';


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
export class ProjectsComponent implements OnInit, OnDestroy {

  projectsInPortuguese: IProjectPortugueseResponse[] = [];
  projects: Project[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carrega os projetos
  */
  private loadProjects(): void {

    console.log('Carregando projetos...');
    const projectsSub = this.projectsService.getProjects().subscribe({
      next: (projects) => {

        console.log('Projetos carregados:', projects);
        // this.projects = projects;
        this.projectsInPortuguese = (projects as unknown as any).data as IProjectPortugueseResponse[];
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
      }
    });
    
    this.subscription.add(projectsSub);
  }

  /**
   * Navega para a página dos projetos
   */
  onViewAllProjects(): void {
    // TODO: Implementar navegação para página
    console.log('Navegar para todos os projetos');
  }

}

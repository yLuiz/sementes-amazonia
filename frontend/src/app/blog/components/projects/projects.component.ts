import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectsService, IProject } from '../../../services/projects/projects.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


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

  projects: IProject[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) { }

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

    const projectsSub = this.projectsService.getProjects({
      limit: 3,
    }).subscribe({
      next: (projects) => {
        this.projects = projects.data;
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
    this.router.navigate(['/list-all'], {
      queryParams: { type: 'project' }
    });
  }

}

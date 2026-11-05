import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ContentCardComponent } from '../../../shared/ui/content-card.component';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, ButtonDirective, ContentCardComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];

  private readonly projectsService = inject(ProjectsService);

  ngOnInit(): void {
    this.projectsService.getProjects({ limit: 3 }).subscribe({
      next: (projects) => (this.projects = projects.data),
      error: (error) => console.error('Erro ao carregar projetos:', error),
    });
  }
}

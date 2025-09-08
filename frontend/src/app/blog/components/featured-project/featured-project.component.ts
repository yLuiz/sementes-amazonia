import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { CommonModule } from '@angular/common';
import { apiConfig } from '../../../config/api.config';

@Component({
  selector: 'app-featured-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-project.component.html',
  styleUrl: './featured-project.component.scss'
})
export class FeaturedProjectComponent {

  project: IProject | null = null;
  imagePath: string | null = null;

  constructor(
    private readonly _router: Router,
    private readonly _projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this._projectsService.getFeaturedProjects().subscribe({
      next: (projects) => {

        console.log('Projetos em destaque:', projects);

        this.project = projects;
        this.imagePath = this.project?.image_thumb ? `${apiConfig.media.base}/${this.project.image_thumb}` : null;
      },
      error: (err) => {
        console.error('Erro ao buscar projetos em destaque:', err);
      }
    })
  }

  onImageLoad(event: Event) {
    (event.target as HTMLImageElement).style.opacity = '1';
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.svg';

    (event.target as HTMLImageElement).style.opacity = '0.125';
  }

  readAboutProject(id?: number) {
    this._router.navigate(['/article', id], {
      queryParams: { type: 'project' }
    });
  }
}

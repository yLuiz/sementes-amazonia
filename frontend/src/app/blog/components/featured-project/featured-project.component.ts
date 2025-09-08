import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProject } from '../../../services/projects/projects.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-project.component.html',
  styleUrl: './featured-project.component.scss'
})
export class FeaturedProjectComponent {

  @Input() project: IProject | null = null;
  @Input() imagePath: string | null = null;

  constructor(
    private readonly _router: Router
  ) { }

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

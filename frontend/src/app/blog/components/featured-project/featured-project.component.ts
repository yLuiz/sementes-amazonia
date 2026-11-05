import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { BadgeComponent } from '../../../shared/ui/badge.component';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ImgFallbackDirective } from '../../../shared/ui/img-fallback.directive';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { mediaUrl } from '../../../shared/utils/media-url';

@Component({
  selector: 'app-featured-project',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink, BadgeComponent, ButtonDirective, ImgFallbackDirective, RevealDirective],
  templateUrl: './featured-project.component.html',
  styleUrl: './featured-project.component.scss',
})
export class FeaturedProjectComponent implements OnInit {
  project: IProject | null = null;
  image = 'assets/photos/community-planting.webp';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly projectsService = inject(ProjectsService);

  ngOnInit(): void {
    this.projectsService.getFeaturedProjects().subscribe({
      next: (project) => {
        this.project = project;
        this.image = mediaUrl(project?.image_thumb) ?? this.image;
        this.cdr.markForCheck();
      },
      // Sem destaque (404) ou com falha, a seção é opcional e apenas não aparece.
      error: () => undefined,
    });
  }
}

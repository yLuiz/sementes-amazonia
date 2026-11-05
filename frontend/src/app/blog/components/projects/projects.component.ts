import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProject, ProjectsService } from '../../../services/projects/projects.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { ContentCardComponent } from '../../../shared/ui/content-card.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonDirective, ContentCardComponent, EmptyStateComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  readonly placeholders = [1, 2, 3];

  projects: IProject[] = [];
  status: 'loading' | 'ready' | 'error' = 'loading';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly projectsService = inject(ProjectsService);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.status = 'loading';
    this.projectsService.getProjects({ limit: 3 }).subscribe({
      next: (projects) => {
        this.projects = projects.data;
        this.status = 'ready';
        this.cdr.markForCheck();
      },
      error: () => {
        this.status = 'error';
        this.cdr.markForCheck();
      },
    });
  }
}

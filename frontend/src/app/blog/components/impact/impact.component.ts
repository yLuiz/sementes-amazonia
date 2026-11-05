import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE_CONTENT } from '../../../shared/content/site-content';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';
import { StatComponent } from '../../../shared/ui/stat.component';

@Component({
  selector: 'app-impact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeaderComponent, StatComponent],
  templateUrl: './impact.component.html',
  styleUrl: './impact.component.scss',
})
export class ImpactComponent {
  readonly stats = SITE_CONTENT.stats;
}

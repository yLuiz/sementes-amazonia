import { Component } from '@angular/core';
import { SITE_CONTENT } from '../../../shared/content/site-content';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [RevealDirective, SectionHeaderComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent {
  readonly partners = SITE_CONTENT.partners;
}

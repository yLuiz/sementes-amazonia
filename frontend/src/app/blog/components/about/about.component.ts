import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../../shared/content/site-content';
import { ButtonDirective } from '../../../shared/ui/button.directive';
import { RevealDirective } from '../../../shared/ui/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, ButtonDirective, RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly intro = SITE_CONTENT.about;
  readonly detail = SITE_CONTENT.aboutDetail;
}

import { Component, ViewEncapsulation } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { FeaturedProjectComponent } from './components/featured-project/featured-project.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { ImpactComponent } from './components/impact/impact.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewsComponent } from './components/news/news.component';
import { PartnersComponent } from './components/partners/partners.component';
import { ProjectsComponent } from './components/projects/projects.component';


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    FeaturedProjectComponent,
    ProjectsComponent,
    PartnersComponent,
    NewsComponent,
    ImpactComponent,
    FooterComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent {

}

import { Component } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { FeaturedProjectComponent } from './components/featured-project/featured-project.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { ImpactComponent } from './components/impact/impact.component';
import { NewsComponent } from './components/news/news.component';
import { PartnersComponent } from './components/partners/partners.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sementes-amazonia';
}

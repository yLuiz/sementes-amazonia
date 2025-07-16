import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsComponent } from '../projects/projects.component';
import { NewsComponent } from '../news/news.component';

@Component({
  selector: 'app-registers',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ProjectsComponent,
    NewsComponent
  ],
  templateUrl: './registers.component.html',
  styleUrl: './registers.component.scss'
})
export class RegistersComponent {

  tab: 'projects' | 'news' = 'projects';

  changeTab(tab: 'projects' | 'news') {
    this.tab = tab;
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsComponent } from '../projects/projects.component';
import { NewsComponent } from '../news/news.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { INews, NewsService } from '../../services/news/news.service';
import { IProject, ProjectsService } from '../../services/projects/projects.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ProjectsComponent,
    NewsComponent,
    SidebarComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  type : 'news' | 'project' = 'news';

  newsToEdit: INews | null = null;
  projectToEdit: IProject | null = null;
  
  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _newsService: NewsService,
    private readonly _projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      const typeParam = params['type'];

      if (typeParam === 'news' || typeParam === 'project') {
        this.type = typeParam;
      }
    });

    this._route.params.subscribe(params => {
      const id = params['id'];

      if (this.type === 'news') {
        this._newsService.getNewsById(id).subscribe(news => {
          this.newsToEdit = news;
        });
      } 
      else if (this.type === 'project') {
        this._projectsService.getProjectById(id).subscribe(project => {
          this.projectToEdit = project;
        });
      }
    });
  }

}

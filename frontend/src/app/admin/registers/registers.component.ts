import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsComponent } from '../projects/projects.component';
import { NewsComponent } from '../news/news.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

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

  tab: 'projects' | 'news' = 'news';

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  changeTab(tab: 'projects' | 'news') {
    this.tab = tab;
  }

  logout() {
    this._authService.logout();
    this.router.navigate(['/admin/login'])
  }
}

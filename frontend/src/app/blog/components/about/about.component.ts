import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  constructor(
    private readonly _router: Router
  ) { }

  goToAboutUs() {
    this._router.navigate(['/about-us']);
  }

  goToProjects() {
    this._router.navigate(['/list-all'], { queryParams: { type: 'projects' } });
  }
}

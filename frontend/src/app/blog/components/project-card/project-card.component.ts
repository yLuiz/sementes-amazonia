import { Component, Input } from '@angular/core';
import { apiConfig } from '../../../config/api.config';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  imageUrl: string = '';

  @Input() image!: string;
  @Input() title!: string;
  @Input() date!: string;
  @Input() description!: string;

  ngOnInit() {
    if (this.image) {
      this.imageUrl = `${apiConfig.media.base}/${this.image}`;

      console.log('Image URL set to:', this.imageUrl);

    } else {
      console.warn('Image input is not provided for project card');
    }
  }

}

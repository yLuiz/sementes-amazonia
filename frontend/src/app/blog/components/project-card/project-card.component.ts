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

  defaultImage = '../../../../assets/no-image.jpg';
  imageUrl: string = '../';

  @Input() image!: string;
  @Input() title!: string;
  @Input() date!: string;
  @Input() description!: string;

  labelDate = '-';

  ngOnInit() {

    this.labelDate = new Date(this.date).toLocaleString('pt-BR').split(',')[0];

    if (this.image) {
      this.imageUrl = `${apiConfig.media.base}/${this.image}`;
    } else {
      console.warn('Image input is not provided for project card');
    }
  }

}

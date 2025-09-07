import { Component, Input } from '@angular/core';
import { apiConfig } from '../../../config/api.config';
import { RouterLink } from '@angular/router';


export interface IProjectCard {
  id: number;
  image: string;
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  defaultImage = '../../../../assets/no-image.svg';
  imageUrl: string = '../';

  @Input() project: IProjectCard | undefined;

  labelDate = '-';

  handleImageError(event: any) {
    event.target.src = this.defaultImage;
    (event.target as HTMLImageElement).style.objectFit = 'contain';
    (event.target as HTMLImageElement).style.opacity = '0.125';
  }

  ngOnInit() {
    this.labelDate = new Date(this.project?.date || '').toLocaleString('pt-BR').split(',')[0];

    if (this.project?.image) {
      this.imageUrl = `${apiConfig.media.base}/${this.project.image}`;
    }
    else {
      console.warn('Image input is not provided for project card');
    }
  }

}

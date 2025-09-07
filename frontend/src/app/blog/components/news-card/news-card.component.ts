import { Component, Input } from '@angular/core';
import { apiConfig } from '../../../config/api.config';
import { RouterLink } from "@angular/router";

export interface INewsCard {
  id: number;
  image: string;
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {

  imageUrl: string = '';
  defaultImage = '../../../../assets/no-image.svg';

  @Input() news: INewsCard | undefined;
  labelDate = '-'

  handleImageError(event: any) {
    event.target.src = this.defaultImage;
    (event.target as HTMLImageElement).style.objectFit = 'contain';
    (event.target as HTMLImageElement).style.opacity = '0.125';
  }

  ngOnInit() {

    this.labelDate = new Date(this.news?.date || '').toLocaleString('pt-BR').split(',')[0];

    if (this.news?.image) {

      
      this.imageUrl = `${apiConfig.media.base}/${this.news.image}`;
      console.log('Image input for news card:', this.imageUrl);
    } else {
      console.warn('Image input is not provided for project card');
    }
  }
}

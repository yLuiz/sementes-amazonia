import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  @Input() image!: string;
  @Input() title!: string;
  @Input() date!: string;
  @Input() description!: string;
}

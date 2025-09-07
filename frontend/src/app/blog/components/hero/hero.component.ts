import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, Carousel } from 'primeng/carousel';
import { NewsService } from '../../../services/news/news.service';
import { capitalize } from '../../../shared/utils/capitalize';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @ViewChild('carousel') carousel!: Carousel;
  currentIndex = 0;

  constructor(
    private readonly _newsService: NewsService
  ) { }

  ngOnInit() {
    this._newsService.getNews({
      limit: 3,
      orderBy: 'id',
      direction: 'DESC'
    })
      .subscribe({
        next: (news) => {
          console.log('Notícias carregadas para o carrossel:', news);
          this.items = news.data.map(n => ({
            image: n.image_thumb || 'assets/amazon_forest.png',
            tag: n.tags.split(',').map(tag => capitalize(tag)) || ['Notícia'],
            title: n.title || 'Título da Notícia',
            text: n.summary || 'Descrição da Notícia',
            button1: 'Leia mais',
            button2: 'Veja outras notícias'
          }));
        },
        error: (error) => {
          console.error('Erro ao carregar notícias para o carrossel:', error);
        }
      })
  }
  
  items = [
    {
      image: 'assets/amazon_forest.png',
      tag: ['Novo'],
      title: 'Protegendo nosso meio ambiente para gerações futuras',
      text: 'A Associação Sem Fins Lucrativos é uma organização dedicada à conservação ambiental, desenvolvimento sustentável e educação comunitária.',
      button1: 'Leia mais',
      button2: 'Veja outras notícias'
    },
    {
      image: 'assets/amazon_forest_2.png',
      tag: ['Destaque'],
      title: 'Projetos de reflorestamento em andamento',
      text: 'Estamos restaurando áreas degradadas e promovendo a biodiversidade na Amazônia com apoio de voluntários.',
      button1: 'Leia mais',
      button2: 'Veja outras notícias'
    },
    {
      image: 'assets/Image 1.png',
      tag: ['Educação'],
      title: 'Educação ambiental para crianças',
      text: 'Nossos programas educacionais envolvem escolas locais e promovem a conscientização ecológica desde cedo.',
      button1: 'Leia mais',
      button2: 'Veja outras notícias'
    }
  ];

  previous() {
    this.carousel.navBackward(new MouseEvent('click'));
  }

  next() {
    this.carousel.navForward(new MouseEvent('click'));
  }

  goToSlide(index: number) {
    const currentPage = this.carousel.page || 0;
    const diff = index - currentPage;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.carousel.navForward(new MouseEvent('click'));
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        this.carousel.navBackward(new MouseEvent('click'));
      }
    }
  }

  onPageChange(event: any) {
    this.currentIndex = event.page;
  }
}

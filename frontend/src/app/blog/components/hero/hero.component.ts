import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, Carousel } from 'primeng/carousel';

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
  
  items = [
    {
      image: 'assets/amazon_forest.png',
      tag: 'Novo',
      title: 'Protegendo nosso meio ambiente para gerações futuras',
      text: 'A Associação Sem Fins Lucrativos é uma organização dedicada à conservação ambiental, desenvolvimento sustentável e educação comunitária.',
      button1: 'Leia mais',
      button2: 'Veja outras notícias'
    },
    {
      image: 'assets/amazon_forest_2.png',
      tag: 'Destaque',
      title: 'Projetos de reflorestamento em andamento',
      text: 'Estamos restaurando áreas degradadas e promovendo a biodiversidade na Amazônia com apoio de voluntários.',
      button1: 'Saiba mais',
      button2: 'Ver projetos'
    },
    {
      image: 'assets/Image 1.png',
      tag: 'Educação',
      title: 'Educação ambiental para crianças',
      text: 'Nossos programas educacionais envolvem escolas locais e promovem a conscientização ecológica desde cedo.',
      button1: 'Conheça',
      button2: 'Ver iniciativas'
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

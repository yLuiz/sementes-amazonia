import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarouselModule } from 'primeng/carousel';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarComponent, CarouselModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  
  @ViewChild('imageCarousel') imageCarousel!: Carousel;
  
  currentImageIndex: number = 0;
  
  images = [
    {
      src: 'assets/amazon_forest.png',
      alt: 'Floresta Amazônica'
    },
    {
      src: 'assets/amazon_forest_2.png', 
      alt: 'Biodiversidade da Amazônia'
    },
    {
      src: 'assets/Image 1.png',
      alt: 'Pesquisa na Amazônia'
    }
  ];
  
  articleData = {
    id: '1',
    title: 'Descoberta de Nova Espécie de Orquídea na Amazônia',
    author: 'Dr. Maria Silva',
    date: new Date('2024-08-15'),
    content: [
      'Pesquisadores da Universidade Federal do Amazonas (UFAM) anunciaram hoje a descoberta de uma nova espécie de orquídea endêmica da região amazônica, destacando mais uma vez a importância da conservação da biodiversidade na maior floresta tropical do mundo.',
      'A nova espécie, batizada de Orchidaceae amazonensis, foi encontrada durante uma expedição científica realizada no coração da floresta, em uma área de difícil acesso próxima ao Rio Negro. A descoberta representa um marco importante para a botânica brasileira e mundial.',
      'Segundo o líder da pesquisa, Dr. João Santos, esta orquídea possui características únicas que a diferenciam de todas as outras espécies já catalogadas. "Suas pétalas apresentam um padrão de coloração nunca antes observado, com tons que variam do rosa ao púrpura, criando um espetáculo visual único", explicou o pesquisador.',
      'A descoberta reforça a necessidade urgente de preservação da Amazônia, que continua sendo fonte de novas descobertas científicas. Estima-se que milhares de espécies ainda não foram catalogadas na região, muitas das quais podem desaparecer antes mesmo de serem descobertas devido ao desmatamento.',
      'A equipe de pesquisadores continuará os estudos sobre esta nova espécie, investigando suas propriedades medicinais potenciais e seu papel no ecossistema local. Os resultados completos da pesquisa serão publicados na próxima edição da revista científica International Journal of Botany.'
    ]
  };

  formattedDate: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Captura o ID da URL
    this.articleData.id = this.route.snapshot.paramMap.get('id') || '';
    
    // Formata a data em português brasileiro
    this.formattedDate = this.formatDateToPtBr(this.articleData.date);
  }

  formatDateToPtBr(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  shareArticle() {
    const currentUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link copiado para a área de transferência!');
      }).catch(() => {
        this.fallbackCopyToClipboard(currentUrl);
      });
    } else {
      this.fallbackCopyToClipboard(currentUrl);
    }
  }

  private fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      alert('Erro ao copiar link. Por favor, copie manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
  }

  // Métodos para navegação do carousel de imagens
  nextImage() {
    if (this.imageCarousel) {
      this.imageCarousel.navForward(new MouseEvent('click'));
    }
  }

  previousImage() {
    if (this.imageCarousel) {
      this.imageCarousel.navBackward(new MouseEvent('click'));
    }
  }

  onPageChange(event: any) {
    this.currentImageIndex = event.page;
  }

  goToSlide(index: number) {
    if (this.imageCarousel) {
      this.currentImageIndex = index;
      // Navegar para o slide específico
      const currentPage = this.imageCarousel.page || 0;
      const diff = index - currentPage;
      
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          this.imageCarousel.navForward(new MouseEvent('click'));
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          this.imageCarousel.navBackward(new MouseEvent('click'));
        }
      }
    }
  }
}

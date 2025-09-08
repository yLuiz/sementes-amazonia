import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { IProject } from '../../../../services/projects/projects.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-article',
  standalone: true,
  imports: [CommonModule, MatIconModule, CarouselModule],
  templateUrl: './project-article.component.html',
  styleUrl: './project-article.component.scss'
})
export class ProjectArticleComponent {
  @Input() project: IProject | null = null;
  @Input() formattedDate: string = '';

  constructor(
    private _toastr: ToastrService
  ) { }

  @ViewChild('imageCarousel') imageCarousel!: Carousel;

  currentImageIndex: number = 0;

  images = [
    {
      src: 'assets/amazon_forest.png',
      alt: 'Floresta Amazônica'
    },
  ];

  ngOnInit() {
    this.images = [
      {
        src: this.project?.image_thumb ?? '',
        alt: this.project?.title ?? ''
      }
    ]
  }

  shareArticle() {
    const currentUrl = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        this._toastr.success('Link copiado para a área de transferência!');
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

  sanitizeTextHtml(input: string): string {
    // Defina as tags permitidas
    const allowedTags = ['strong', 'em', 'b', 'i', 'u', 'br'];

    // Regex para encontrar todas as tags
    return input.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag) => {
      return allowedTags.includes(tag.toLowerCase()) ? match : '';
    });
  }
}

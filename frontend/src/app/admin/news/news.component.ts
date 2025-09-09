import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { CalendarDateComponent } from '../../blog/components/calendar-date/calendar-date.component';
import { apiConfig } from '../../config/api.config';
import { INews, NewsService } from '../../services/news/news.service';

export interface INewsFormData {
  title: string;
  summary: string;
  content: string;
  author?: string;
  tags?: string;
  image_thumb?: File; // Arquivo que vai no FormData
  published_at?: string; // ISO string
  created_at?: string;
  updated_at?: string;
}

export type INewsUpdateFormData = Partial<INewsFormData>;

@Component({
  standalone: true,
  selector: 'app-news',
  imports: [
    MatIconModule, CommonModule, ReactiveFormsModule,
    CalendarDateComponent, ButtonModule
  ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  form: FormGroup = this.fb.group({});
  imagePreviewUrl: string | null = null;

  @Input()
  news: INews | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    private _newsService: NewsService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.news?.title ?? '', Validators.required],
      summary: [this.news?.summary ?? '', Validators.required],
      content: [this.news?.content ?? '', Validators.required],
      published_at: [this.news?.published_at ?? ''],
      author: [this.news?.author ?? ''],
      tags: [this.news?.tags ?? ''],
      image_thumb: [null]
    });

    this.imagePreviewUrl = this.news?.image_thumb ? apiConfig.media.base + `/${this.news.image_thumb}` : null;
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.form.patchValue({ image_thumb: null });
      this.imagePreviewUrl = null;
      return;
    }

    // Tipos permitidos
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExt = /\.(jpe?g|png|webp)$/i;

    const isValidType =
      allowedMimes.includes(file.type) || allowedExt.test(file.name);

    if (!isValidType) {
      this._toastr.error(
        'Formato de arquivo inválido. Apenas JPEG, JPG, PNG e WEBP são permitidos.',
        'Arquivo não suportado',
        { closeButton: true, progressBar: true }
      );

      // Limpa o input e o form
      input.value = '';
      this.form.patchValue({ image_thumb: null });
      this.imagePreviewUrl = null;
      return;
    }


    // Válido → atualiza form e preview
    this.form.patchValue({ image_thumb: file });
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();

      Object.entries(this.form.value).forEach(([key, value]) => {
        if (!value) return;

        if (key === 'published_at') {
          formData.append(key, new Date(value as string).toISOString());
        } else if (key === 'image_thumb') {
          formData.append(key, value as File);
        } else {
          formData.append(key, value as string);
        }
      });

      if (this.news) {
        this.updateNews(formData);
        return;
      }

      this.createNews(formData);
    }
  }

  createNews(formData: FormData) {
    this._newsService.createNews(formData).subscribe({
      next: () => {
        this._toastr.success('Notícia criada com sucesso.', 'Sucesso.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });

        this.clearForm();
        this._router.navigate(['/list-all'], { queryParams: { type: 'news' } });

      },
      error: (err) => {
        console.error('News: ', err);
        this._toastr.error(`Houve um erro ao ${this.news ? 'atualizar' : 'criar'} a notícia.`, 'Falha.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });
      }
    });
  }

  updateNews(formData: FormData) {
    this._newsService.updateNews(this.news!.id, formData).subscribe({
      next: () => {
        this._toastr.success('Notícia atualizada com sucesso.', 'Sucesso.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });
        this.clearForm();

        this._router.navigate(['/list-all'], { queryParams: { type: 'news' } });
      },
      error: (err) => {
        console.error(err);
        this._toastr.error(`Houve um erro ao atualizar a notícia.`, 'Falha.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });
      }
    });
  }

  removeImage(event: Event) {

    event.preventDefault();
    event.stopPropagation();
    

    this.form.patchValue({ image_thumb: null });
    this.imagePreviewUrl = null;
    if (this.news) {
      this.news.image_thumb = '';
    }
  }

  get publishedAt() {
    return this.form.get('published_at')?.value;
  }

  get image_thumb() {
    return this.form.get('image_thumb')?.value;
  }

  clearForm() {
    this.form.reset();
    this.imagePreviewUrl = null;
  }
}

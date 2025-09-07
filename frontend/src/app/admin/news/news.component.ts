import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news/news.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarDateComponent } from '../../blog/components/calendar-date/calendar-date.component';

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
    CalendarDateComponent
  ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  form: FormGroup;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _newsService: NewsService,
    private _toastr: ToastrService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      published_at: [''],
      author: [''],
      tags: [''],
      image_thumb: [null]
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.patchValue({ image_thumb: file });

      // Gera o preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = null;
    }
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

      this._newsService.createNews(formData).subscribe({
        next: () => {
          this._toastr.success('Notícia criada com sucesso.', 'Sucesso.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });
          this.clearForm();
        },
        error: (err) => {
          console.error('News: ', err);
          this._toastr.error('Houve um erro ao criar a notícia.', 'Falha.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });
        }
      });
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

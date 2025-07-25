import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news/news.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-news',
  imports: [
    MatIconModule, CommonModule, ReactiveFormsModule
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
      titulo: ['', Validators.required],
      resumo: ['', Validators.required],
      conteudoCompleto: ['', Validators.required],
      dataPublicacao: ['', Validators.required],
      tags: [''],
      imagemThumb: [null]
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.patchValue({ imagemThumb: file });

      // Gera o preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    else {
      this.imagePreviewUrl = null;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      Object.entries(this.form.value).forEach(([key, value]) => {
        // Para data, converter para ISO string se necessário
        if (key === 'dataPublicacao' && value) {
          // Se já for ISO, só adiciona
          formData.append(key, new Date(value as string).toISOString());
        } else if (key === 'imagemThumb' && value) {
          formData.append(key, value as string); // arquivo
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      this._newsService.createNews(formData).subscribe({
        next: (res) => {
          this._toastr.success('Notícia criada com sucesso.', 'Sucesso.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });

          this.clearForm();
        },
        error: (err) => {
          console.error('News: ', err)

          this._toastr.error('Houve um erro ao criar a notícia.', 'Falha.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });
        }
      });
    }


  }

  get imagemThumb() {
    return this.form.get('imagemThumb')?.value;
  }

  clearForm() {
    this.form.reset();
    this.imagePreviewUrl = null;
  }
}
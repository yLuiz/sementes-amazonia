import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news/news.service';

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

  constructor(
    private fb: FormBuilder,
    private _newsService: NewsService,
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
          console.log(res)
          console.log('News - Criado com sucesso.')
          this.clearForm();
        },
        error: (err) => {
          console.error('News: ', err)
        }
      });

      let obj = {}
      formData.forEach((v, k) => {
        obj = {
          ...obj,
          [k as any]: v
        }
      })

      console.log(obj);

    }


  }

  clearForm() {
    this.form.reset();
  }
}
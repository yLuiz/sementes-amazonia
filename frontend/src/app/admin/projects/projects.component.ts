import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects/projects.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarDateComponent } from '../../blog/components/calendar-date/calendar-date.component';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    CalendarDateComponent
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  form: FormGroup;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _projectsService: ProjectsService,
    private _toastr: ToastrService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],          // nome → title
      summary: ['', Validators.required],        // resumo → summary
      content: ['', Validators.required],        // descricaoCompleta → content
      image_thumb: [null],                       // imagemThumb → image_thumb
      published_at: ['']                         // opcional
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.patchValue({ image_thumb: file });
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
          // Converter de "YYYY-MM-DDTHH:mm" para "YYYY-MM-DD HH:mm:ss"
          const date = new Date(value as string);
          const formatted = date.toISOString().slice(0, 19).replace('T', ' ');
          formData.append(key, formatted);
        } else if (key === 'image_thumb') {
          formData.append(key, value as File);
        } else {
          formData.append(key, value as string);
        }
      });

      this._projectsService.createProject(formData).subscribe({
        next: () => {
          this._toastr.success('Projeto criado com sucesso.', 'Sucesso.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });
          this.clearForm();
        },
        error: (err) => {
          console.error('Project: ', err);
          this._toastr.error('Houve um erro ao criar o projeto.', 'Falha.', {
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

  get imageThumbControl() {
    return this.form.get('image_thumb')?.value;
  }

  clearForm() {
    this.form.reset();
    this.imagePreviewUrl = null;
  }
}

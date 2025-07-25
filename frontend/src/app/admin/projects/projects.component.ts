import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects/projects.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule
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
      nome: ['', Validators.required],
      resumo: ['', Validators.required],
      descricaoCompleta: ['', Validators.required],
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
        if (key === 'imagemThumb' && value) {
          formData.append(key, value as string); // arquivo
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // Aqui você faz a requisição para o backend (exemplo):
      // this.projectsService.createProject(formData).subscribe(...);

      this._projectsService.createProject(formData).subscribe({
        next: (res) => {
          this._toastr.success('Projeto criado com sucesso.', 'Sucesso.', {
            closeButton: true,
            tapToDismiss: true,
            progressBar: true
          });
          this.clearForm();
        },
        error: (err) => {
          console.error('Project: ', err)
          this._toastr.error('Houve um erro ao criar o projeto.', 'Falha.', {
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
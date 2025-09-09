import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IProject, ProjectsService } from '../../services/projects/projects.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarDateComponent } from '../../blog/components/calendar-date/calendar-date.component';
import { Router } from '@angular/router';
import { apiConfig } from '../../config/api.config';

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

  @Input() project: IProject | null = null;

  form: FormGroup = this.fb.group({});
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    private _projectsService: ProjectsService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.project?.title ?? '', Validators.required],          // nome → title
      summary: [this.project?.summary ?? '', Validators.required],        // resumo → summary
      content: [this.project?.content ?? '', Validators.required], // descricaoCompleta → content
      author: [this.project?.author ?? ''],
      image_thumb: [null],                       // imagemThumb → image_thumb
      published_at: [this.project?.published_at ?? '']                         // opcional
    });

    this.imagePreviewUrl = this.project?.image_thumb ? apiConfig.media.base + `/${this.project.image_thumb}` : null;
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

      if (this.project) {
        this.updateProject(formData);
        return;
      }

      this.createProject(formData);
      return;
    }
  }

  removeImage(event: Event) {

    event.preventDefault();
    event.stopPropagation();


    this.form.patchValue({ image_thumb: null });
    this.imagePreviewUrl = null;
    if (this.project) {
      this.project.image_thumb = '';
    }
  }

  createProject(formData: FormData) {
    this._projectsService.createProject(formData).subscribe({
      next: () => {
        this._toastr.success('Projeto criado com sucesso.', 'Sucesso.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });

        this.clearForm();
        this._router.navigate(['/list-all'], { queryParams: { type: 'projects' } });
      },
      error: (err) => {
        console.error('Project: ', err);
        this._toastr.error(`Houve um erro ao ${this.project ? 'atualizar' : 'criar'} o projeto.`, 'Falha.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });
      }
    });
  }

  updateProject(formData: FormData) {
    this._projectsService.updateProject(this.project!.id, formData).subscribe({
      next: () => {
        this._toastr.success('Projeto atualizado com sucesso.', 'Sucesso.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });

        this.clearForm();
        this._router.navigate(['/list-all'], { queryParams: { type: 'projects' } });
      },
      error: (err) => {
        console.error('Project: ', err);
        this._toastr.error(`Houve um erro ao ${this.project ? 'atualizar' : 'criar'} o projeto.`, 'Falha.', {
          closeButton: true,
          tapToDismiss: true,
          progressBar: true
        });
      }
    });
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

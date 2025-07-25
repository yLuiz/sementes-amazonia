import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects/projects.service';

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

  constructor(
    private fb: FormBuilder,
    private _projectsService: ProjectsService
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
          console.log(res)
          console.log('Project - Criado com sucesso.')
          this.clearForm();
        },
        error: (err) => {
          console.error('Project: ', err)
        }
      })

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
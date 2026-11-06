import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CalendarDateComponent } from '../../blog/components/calendar-date/calendar-date.component';
import { INews, NewsService } from '../../services/news/news.service';
import { IProject, ProjectsService } from '../../services/projects/projects.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { ContentType } from '../../shared/ui/content-card.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { FileUploadComponent } from '../../shared/ui/file-upload.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { apiErrorMessage, isNotFoundError } from '../../shared/utils/api-error';
import { mediaUrl } from '../../shared/utils/media-url';
import { CONTENT_LABELS } from '../shared/content-labels';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Formulário único de notícia e de projeto; o tipo vem do `data` da rota. */
@Component({
  selector: 'app-content-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonDirective,
    CalendarDateComponent,
    EmptyStateComponent,
    FileUploadComponent,
    FormFieldComponent,
    PageHeaderComponent,
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
})
export class ContentFormComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly newsService = inject(NewsService);
  private readonly projectsService = inject(ProjectsService);
  private readonly toastr = inject(ToastrService);

  readonly type: ContentType = this.route.snapshot.data['type'];
  readonly labels = CONTENT_LABELS[this.type];
  readonly basePath = this.type === 'news' ? '/admin/news' : '/admin/projects';
  readonly titleMaxLength = this.type === 'news' ? 150 : 100;
  readonly itemId = Number(this.route.snapshot.paramMap.get('id')) || null;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    summary: ['', Validators.required],
    content: ['', Validators.required],
    published_at: ['', Validators.required],
    author: [''],
    tags: [''],
    is_featured: [false],
    image_thumb: [null as File | null],
  });

  status: 'loading' | 'ready' | 'notFound' | 'error' = this.itemId ? 'loading' : 'ready';
  isSubmitting = false;
  imagePreviewUrl: string | null = null;
  imageFileName = '';
  /** Este projeto já era o destaque quando a edição começou. */
  wasFeatured = false;

  @ViewChild('upload') private upload?: FileUploadComponent;
  private request?: Subscription;

  ngOnInit(): void {
    if (this.itemId) this.load();
  }

  load(): void {
    if (!this.itemId) return;

    const source: Observable<INews | IProject> =
      this.type === 'news' ? this.newsService.getNewsById(this.itemId) : this.projectsService.getProjectById(this.itemId);

    this.status = 'loading';
    this.cdr.markForCheck();
    this.request?.unsubscribe();
    this.request = source.subscribe({
      next: (item) => {
        this.form.patchValue({
          title: item.title,
          summary: item.summary,
          content: item.content,
          published_at: item.published_at,
          author: item.author ?? '',
          tags: 'tags' in item ? item.tags : '',
          is_featured: 'is_featured' in item && !!item.is_featured,
        });
        this.wasFeatured = 'is_featured' in item && !!item.is_featured;
        this.imagePreviewUrl = mediaUrl(item.image_thumb);
        this.imageFileName = item.image_thumb ?? '';
        this.status = 'ready';
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.status = isNotFoundError(error) ? 'notFound' : 'error';
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  get missingFields(): string[] {
    const controls = this.form.controls;
    return [
      !controls.title.value?.trim() && this.labels.titleLabel.toLowerCase(),
      !controls.summary.value?.trim() && 'resumo',
      !controls.published_at.value && 'data de publicação',
      !controls.content.value?.trim() && this.labels.contentLabel.toLowerCase(),
    ].filter((label): label is string => !!label);
  }

  get featuredHint(): string {
    const checked = !!this.form.controls.is_featured.value;
    if (this.wasFeatured) {
      return checked ? 'Este é o projeto em destaque no site hoje.' : 'Ao salvar, o site fica sem projeto em destaque.';
    }
    return 'Ganha uma seção própria na página inicial. Só um projeto fica em destaque por vez: marcar este substitui o atual.';
  }

  onFileSelected(file: File): void {
    const isValidType = ALLOWED_MIMES.includes(file.type) || ALLOWED_EXTENSIONS.test(file.name);
    if (!isValidType) {
      this.toastr.error('Apenas JPEG, JPG, PNG e WEBP são permitidos.', 'Arquivo não suportado');
      this.upload?.reset();
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      this.toastr.error('A imagem deve ter até 5 MB.', 'Arquivo muito grande');
      this.upload?.reset();
      return;
    }

    this.form.patchValue({ image_thumb: file });
    this.imageFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.form.patchValue({ image_thumb: null });
    this.imagePreviewUrl = null;
    this.imageFileName = '';
  }

  clearForm(): void {
    this.form.reset({ is_featured: false });
    this.upload?.reset();
    this.removeImage();
  }

  onSubmit(): void {
    if (this.missingFields.length || this.isSubmitting) return;

    this.isSubmitting = true;
    this.save(this.buildFormData()).subscribe({
      next: () => {
        this.toastr.success(this.itemId ? this.labels.updated : this.labels.created, 'Sucesso.');
        this.router.navigate([this.basePath]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(apiErrorMessage(error, `Não foi possível ${this.itemId ? 'atualizar' : 'publicar'}. Tente novamente.`), 'Falha.');
        this.cdr.markForCheck();
      },
    });
  }

  private save(formData: FormData): Observable<unknown> {
    if (this.type === 'news') {
      return this.itemId ? this.newsService.updateNews(this.itemId, formData) : this.newsService.createNews(formData);
    }
    return this.itemId
      ? this.projectsService.updateProject(this.itemId, formData)
      : this.projectsService.createProject(formData);
  }

  private buildFormData(): FormData {
    const { title, summary, content, author, tags, is_featured, published_at, image_thumb } = this.form.getRawValue();
    const formData = new FormData();

    formData.append('title', title!);
    formData.append('summary', summary!);
    formData.append('content', content!);
    if (author) formData.append('author', author);
    // A API de projetos rejeita campos que não conhece, como `tags`.
    if (this.type === 'news' && tags) formData.append('tags', tags);
    // Vai sempre, inclusive `false`, para que desmarcar também chegue à API.
    if (this.type === 'project') formData.append('is_featured', is_featured ? 'true' : 'false');
    if (image_thumb) formData.append('image_thumb', image_thumb);

    const date = new Date(published_at!).toISOString();
    formData.append('published_at', this.type === 'news' ? date : date.slice(0, 19).replace('T', ' '));

    return formData;
  }
}

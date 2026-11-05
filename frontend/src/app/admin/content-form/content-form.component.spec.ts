import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ContentFormComponent } from './content-form.component';

describe('ContentFormComponent', () => {
  let fixture: ComponentFixture<ContentFormComponent>;
  let component: ContentFormComponent;
  let controller: HttpTestingController;
  let toastError: jasmine.Spy;

  const element = () => fixture.nativeElement as HTMLElement;
  const checkbox = () => element().querySelector<HTMLInputElement>('#field-featured');

  const setup = (type: 'news' | 'project', id: string | null = null) => {
    TestBed.configureTestingModule({
      imports: [ContentFormComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { type }, paramMap: convertToParamMap(id ? { id } : {}) } } },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
    toastError = spyOn(TestBed.inject(ToastrService), 'error');
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(ContentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const fill = () =>
    component.form.patchValue({ title: 'Título', summary: 'Resumo', content: 'Texto', published_at: '2026-11-05' });

  const sentForm = (url: string) => controller.expectOne(url).request.body as FormData;

  afterEach(() => controller.verify());

  describe('projeto em destaque', () => {
    it('o campo só existe em projetos', () => {
      setup('news');
      expect(checkbox()).toBeNull();
    });

    it('avisa que marcar substitui o destaque atual', () => {
      setup('project');
      expect(checkbox()).not.toBeNull();
      expect(element().querySelector('.feature-option')?.textContent).toContain('substitui o atual');
    });

    it('envia "true" ao marcar', () => {
      setup('project');
      fill();
      checkbox()!.click();
      component.onSubmit();
      expect(sentForm('/api/v1/projects').get('is_featured')).toBe('true');
    });

    it('envia "false" sem marcar', () => {
      setup('project');
      fill();
      component.onSubmit();
      expect(sentForm('/api/v1/projects').get('is_featured')).toBe('false');
    });

    it('notícia não envia o campo', () => {
      setup('news');
      fill();
      component.onSubmit();
      expect(sentForm('/api/v1/news').has('is_featured')).toBeFalse();
    });

    it('carrega o valor na edição, e desmarcar avisa e envia "false"', () => {
      setup('project', '7');
      controller.expectOne('/api/v1/projects/7').flush({
        id: 7, title: 'T', summary: 'R', content: 'C', published_at: '2026-11-05', image_thumb: null, is_featured: true,
      });
      fixture.detectChanges();

      expect(checkbox()!.checked).toBeTrue();
      expect(element().querySelector('.feature-option')?.textContent).toContain('em destaque no site hoje');

      checkbox()!.click();
      fixture.detectChanges();
      expect(element().querySelector('.feature-option')?.textContent).toContain('fica sem projeto em destaque');

      component.onSubmit();
      expect(sentForm('/api/v1/projects/7').get('is_featured')).toBe('false');
    });

    it('limpar o formulário desmarca o campo', () => {
      setup('project');
      checkbox()!.click();
      component.clearForm();
      fixture.detectChanges();
      expect(checkbox()!.checked).toBeFalse();
    });
  });

  describe('estados da edição', () => {
    it('falha da API mostra aviso, e tentar de novo carrega', () => {
      setup('project', '7');
      controller.expectOne('/api/v1/projects/7').flush(null, { status: 500, statusText: 'Erro' });
      fixture.detectChanges();

      expect(element().textContent).toContain('Não foi possível carregar o conteúdo');
      element().querySelector<HTMLButtonElement>('app-empty-state button')!.click();
      fixture.detectChanges();
      expect(element().querySelector('.form-placeholder')).not.toBeNull();

      controller.expectOne('/api/v1/projects/7').flush({
        id: 7, title: 'Voltou', summary: 'R', content: 'C', published_at: '2026-11-05', image_thumb: null,
      });
      fixture.detectChanges();
      expect(element().querySelector<HTMLInputElement>('#field-title')?.value).toBe('Voltou');
    });

    it('404 mostra "não encontrado", sem tentar de novo', () => {
      setup('news', '7');
      controller.expectOne('/api/v1/news/7').flush(null, { status: 404, statusText: 'Not Found' });
      fixture.detectChanges();

      expect(element().textContent).toContain('Notícia não encontrada');
      expect(element().textContent).not.toContain('Tentar novamente');
    });
  });

  describe('erros ao salvar', () => {
    const failWith = (status: number, body: object) => {
      setup('news');
      fill();
      component.onSubmit();
      controller.expectOne('/api/v1/news').flush(body, { status, statusText: 'Erro' });
      fixture.detectChanges();
    };

    it('mostra a mensagem da API e libera o botão', () => {
      failWith(400, { statusCode: 400, message: ['Título muito longo', 'Resumo inválido'] });
      expect(toastError).toHaveBeenCalledWith('Título muito longo. Resumo inválido.', 'Falha.');
      expect(element().querySelector<HTMLButtonElement>('button[type=submit]')!.disabled).toBeFalse();
    });

    it('413 diz o limite da imagem', () => {
      failWith(413, { statusCode: 413, message: 'File too large' });
      expect(toastError).toHaveBeenCalledWith('Imagem acima de 5 MB.', 'Falha.');
    });

    it('500 usa a mensagem do formulário', () => {
      failWith(500, { statusCode: 500, message: 'Erro interno do servidor' });
      expect(toastError).toHaveBeenCalledWith('Não foi possível publicar. Tente novamente.', 'Falha.');
    });
  });
});

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideToastr(), provideNoopAnimations()],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('erros ao entrar', () => {
    const failWith = (status: number, body: object) => {
      component.form.setValue({ username: 'admin', password: 'senha' });
      component.onSubmit();
      TestBed.inject(HttpTestingController)
        .expectOne('/api/v1/auth/login')
        .flush(body, { status, statusText: 'Erro' });
      fixture.detectChanges();
      return (fixture.nativeElement as HTMLElement).querySelector('.login__error')?.textContent?.trim();
    };

    it('429 mostra a mensagem da API', () => {
      expect(failWith(429, { statusCode: 429, message: 'Muitas tentativas. Aguarde 15 minutos' })).toBe('Muitas tentativas. Aguarde 15 minutos.');
    });

    it('401 mantém o aviso de credenciais', () => {
      expect(failWith(401, { statusCode: 401, message: 'Unauthorized' })).toBe('Usuário ou senha incorretos.');
    });

    it('500 não mostra o texto da API', () => {
      expect(failWith(500, { statusCode: 500, message: 'Erro interno do servidor' })).toBe('Não foi possível entrar. Tente novamente.');
    });
  });
});

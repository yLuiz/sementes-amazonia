import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let component: ChangePasswordComponent;
  let controller: HttpTestingController;

  const fill = (newPassword: string, confirmPassword = newPassword) =>
    component.form.setValue({ oldPassword: 'senha-atual', newPassword, confirmPassword });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideToastr(), provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    controller = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => controller.verify());

  it('não envia senha curta', () => {
    fill('curta');
    component.onSubmit();
    controller.expectNone('/api/v1/auth/change-password');
    expect(component.newPasswordError).toContain('12');
  });

  it('não envia se a confirmação for diferente', () => {
    fill('uma-senha-bem-longa', 'outra-senha-bem-longa');
    component.onSubmit();
    controller.expectNone('/api/v1/auth/change-password');
    expect(component.confirmPasswordError).toBeTruthy();
  });

  it('envia só as senhas atual e nova, e limpa o formulário', () => {
    fill('uma-senha-bem-longa');
    component.onSubmit();

    const call = controller.expectOne('/api/v1/auth/change-password');
    expect(call.request.body).toEqual({ oldPassword: 'senha-atual', newPassword: 'uma-senha-bem-longa' });
    call.flush({ message: 'ok' });

    expect(component.form.getRawValue().newPassword).toBeNull();
  });

  it('mostra o motivo quando a API recusa', () => {
    fill('uma-senha-bem-longa');
    component.onSubmit();
    controller
      .expectOne('/api/v1/auth/change-password')
      .flush({ message: 'Senha atual incorreta' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage).toBe('Senha atual incorreta.');
    expect(component.isSaving).toBeFalse();
  });
});

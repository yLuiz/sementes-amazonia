import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let navigate: jasmine.Spy;
  let warning: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideToastr(),
        provideNoopAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    warning = spyOn(TestBed.inject(ToastrService), 'warning');
  });

  afterEach(() => controller.verify());

  it('adiciona o cabeçalho nas escritas da API', () => {
    http.post('/api/v1/news', {}).subscribe();
    const { request } = controller.expectOne('/api/v1/news');
    expect(request.headers.get('X-Requested-With')).toBe('sementes-web');
  });

  it('não adiciona o cabeçalho em leituras nem fora da API', () => {
    http.get('/api/v1/news').subscribe();
    http.post('https://exemplo.org/coleta', {}).subscribe();
    expect(controller.expectOne('/api/v1/news').request.headers.has('X-Requested-With')).toBeFalse();
    expect(controller.expectOne('https://exemplo.org/coleta').request.headers.has('X-Requested-With')).toBeFalse();
  });

  it('um 401 durante o uso avisa e leva ao login, sem repassar o erro', () => {
    let failed = false;
    http.delete('/api/v1/news/1').subscribe({ error: () => (failed = true) });
    controller.expectOne('/api/v1/news/1').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['/admin/login']);
    expect(failed).toBeFalse();
  });

  it('o 401 do login e o da verificação de sessão ficam com quem chamou', () => {
    let failures = 0;
    const onError = { error: () => failures++ };
    http.post('/api/v1/auth/login', {}).subscribe(onError);
    http.get('/api/v1/auth/me').subscribe(onError);
    controller.expectOne('/api/v1/auth/login').flush(null, { status: 401, statusText: 'Unauthorized' });
    controller.expectOne('/api/v1/auth/me').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(failures).toBe(2);
    expect(warning).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('outros erros seguem para quem chamou', () => {
    let status = 0;
    http.put('/api/v1/auth/change-password', {}).subscribe({ error: (error) => (status = error.status) });
    controller.expectOne('/api/v1/auth/change-password').flush(null, { status: 400, statusText: 'Bad Request' });

    expect(status).toBe(400);
    expect(navigate).not.toHaveBeenCalled();
  });
});

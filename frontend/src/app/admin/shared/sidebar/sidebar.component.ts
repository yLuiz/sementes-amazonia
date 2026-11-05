import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  /** Só tem efeito abaixo de 1024px; acima disso a barra fica sempre visível. */
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  readonly menuItems = [
    { label: 'Notícias', icon: 'pi-file-edit', route: '/admin/news' },
    { label: 'Projetos', icon: 'pi-briefcase', route: '/admin/projects' },
    { label: 'Trocar senha', icon: 'pi-key', route: '/admin/password' },
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.toastr.error('Não foi possível sair. Tente novamente.'),
    });
  }
}

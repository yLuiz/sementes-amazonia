import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
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
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}

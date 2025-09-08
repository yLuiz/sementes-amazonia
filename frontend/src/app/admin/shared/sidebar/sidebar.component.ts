import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  
  sidebarVisible: boolean = false;

  menuItems = [
    {
      label: 'Cadastros',
      icon: 'pi pi-plus',
      route: '/admin/registers',
      active: false,
      queryParams: null
    },
    {
      label: 'Notícias',
      icon: 'pi pi-file-edit',
      route: 'admin/list-all',
      active: false,
      queryParams: { type: 'news' }
    },
    {
      label: 'Projetos',
      icon: 'pi pi-briefcase',
      route: 'admin/list-all',
      active: false,
      queryParams: { type: 'projects' }
    }
  ];

  constructor(
    private _authService: AuthService,
    private router: Router
  ) {
  }

  navigateTo(route: string) {
    this.menuItems.forEach(item => item.active = false);
    const selectedItem = this.menuItems.find(item => item.route === route);
    if (selectedItem) {
      selectedItem.active = true;      

      if (selectedItem.queryParams) {
        this.router.navigate([route], { queryParams: selectedItem.queryParams });
      } else {
        this.router.navigate([route]);
      }
    }
  }

  navigateToItem(index: number) {
    this.menuItems.forEach(item => item.active = false);
    const selectedItem = this.menuItems[index];
    if (selectedItem) {
      selectedItem.active = true;

      
      // Navegar com query parameters se existirem
      if (selectedItem.queryParams) {
  
        this.router.navigate([selectedItem.route], { queryParams: selectedItem.queryParams });
      } else {
  
        this.router.navigate([selectedItem.route]);
      }
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  logout() {
    this._authService.logout();
    this.router.navigate(['/admin/login'])
  }

  goToWebsite() {
    this.router.navigate(['/']);
  }
}

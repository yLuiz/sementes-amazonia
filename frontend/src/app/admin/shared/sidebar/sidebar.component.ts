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
  
  sidebarVisible: boolean = true;

  menuItems = [
    {
      label: 'Register',
      icon: 'pi pi-home',
      route: '/admin/registers',
      active: false,
      queryParams: null
    },
    {
      label: 'Notícias',
      icon: 'pi pi-file-edit',
      route: '/list-all',
      active: false,
      queryParams: { type: 'news' }
    },
    {
      label: 'Projetos',
      icon: 'pi pi-briefcase',
      route: '/list-all',
      active: false,
      queryParams: { type: 'project' }
    },
    {
      label: 'Configurações',
      icon: 'pi pi-cog',
      route: '/admin/settings',
      active: false,
      queryParams: null
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
    console.log('Navegando para item índice:', index);
    this.menuItems.forEach(item => item.active = false);
    const selectedItem = this.menuItems[index];
    if (selectedItem) {
      selectedItem.active = true;
      console.log('Item selecionado por índice:', selectedItem);
      
      // Navegar com query parameters se existirem
      if (selectedItem.queryParams) {
        console.log('Navegando com query params:', selectedItem.queryParams);
        this.router.navigate([selectedItem.route], { queryParams: selectedItem.queryParams });
      } else {
        console.log('Navegando sem query params');
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

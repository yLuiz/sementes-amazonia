import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  isMobileDropdownOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isMobileDropdownOpen = false;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isMobileDropdownOpen = false;
  }

  toggleMobileDropdown(event: Event) {
    event.preventDefault();
    this.isMobileDropdownOpen = !this.isMobileDropdownOpen;
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (this.isMenuOpen && hamburgerMenu && !hamburgerMenu.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }
}

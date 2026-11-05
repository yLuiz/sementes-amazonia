import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollStateService } from '../../../services/scroll-state.service';
import { ButtonDirective } from '../../../shared/ui/button.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  /** Transparente sobre o hero até o início da rolagem; sem isso, sempre sólida. */
  @Input() overlay = false;

  isMenuOpen = false;
  isDropdownOpen = false;
  scrolled = false;

  readonly activeOptions = {
    paths: 'exact',
    queryParams: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
  } as const;

  private readonly document = inject(DOCUMENT);
  private readonly scrollState = inject(ScrollStateService);
  private scrollSubscription?: Subscription;

  ngOnInit(): void {
    this.scrollSubscription = this.scrollState.pastOffset(80).subscribe((past) => (this.scrolled = past));
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
    this.lockScroll(false);
  }

  toggleMenu(): void {
    this.setMenu(!this.isMenuOpen);
  }

  closeMenu(): void {
    this.setMenu(false);
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  goToContact(): void {
    this.closeMenu();
    this.document.getElementById('footer')?.scrollIntoView();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdown();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
    this.closeDropdown();
  }

  private setMenu(open: boolean): void {
    this.isMenuOpen = open;
    this.lockScroll(open);
  }

  private lockScroll(locked: boolean): void {
    this.document.body.style.overflow = locked ? 'hidden' : '';
  }
}

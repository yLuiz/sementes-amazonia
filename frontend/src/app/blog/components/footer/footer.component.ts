import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollStateService } from '../../../services/scroll-state.service';
import { SITE_CONTENT } from '../../../shared/content/site-content';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  readonly content = SITE_CONTENT;
  readonly phoneHref = SITE_CONTENT.contact.phone.replace(/[^+\d]/g, '');
  readonly year = new Date().getFullYear();

  showBackToTop = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scrollState = inject(ScrollStateService);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.scrollState
      .pastOffset(window.innerHeight)
      .subscribe((past) => {
        this.showBackToTop = past;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  backToTop(): void {
    window.scrollTo({ top: 0 });
  }
}

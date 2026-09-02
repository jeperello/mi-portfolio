import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsDirective } from './analytics.directive';
import { ThemeService } from '../core/services/theme.service';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AnalyticsDirective, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public readonly themeService = inject(ThemeService);
  public showBlogTooltip = signal(false);
  public isMenuOpen = signal(false);

  private tooltipOpenTimer?: ReturnType<typeof setTimeout>;
  private tooltipHideTimer?: ReturnType<typeof setTimeout>;
  private hasShownBlogTooltip = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const isProjectRoot = event.urlAfterRedirects === '/';

        if (!isProjectRoot) {
          this.clearTooltipTimers();
          this.showBlogTooltip.set(false);
          return;
        }

        this.scheduleBlogTooltip();
      });

    if (this.router.url === '/') {
      this.scheduleBlogTooltip();
    } else {
      this.clearTooltipTimers();
      this.showBlogTooltip.set(false);
    }
  }

  private clearTooltipTimers(): void {
    if (this.tooltipOpenTimer) {
      clearTimeout(this.tooltipOpenTimer);
      this.tooltipOpenTimer = undefined;
    }

    if (this.tooltipHideTimer) {
      clearTimeout(this.tooltipHideTimer);
      this.tooltipHideTimer = undefined;
    }
  }

  private scheduleBlogTooltip(): void {
    if (this.hasShownBlogTooltip) return;

    this.clearTooltipTimers();
    this.showBlogTooltip.set(false);

    this.tooltipOpenTimer = setTimeout(() => {
      this.hasShownBlogTooltip = true;
      this.showBlogTooltip.set(true);

      this.tooltipHideTimer = setTimeout(() => {
        if (this.showBlogTooltip()) {
          this.showBlogTooltip.set(false);
        }
      }, 9000);
    }, 2500);
  }

  hideTooltip(): void {
    this.clearTooltipTimers();
    if (this.showBlogTooltip()) {
      this.showBlogTooltip.set(false);
    }
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AnalyticsDirective } from '../analytics.directive';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, AnalyticsDirective],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss']
})
export class ThemeToggleComponent {
  // Dependency Inversion: inject the ThemeService implementation
  protected readonly themeService = inject(ThemeService);

  public toggle(): void {
    this.themeService.toggleTheme();
  }
}

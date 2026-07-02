import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ChatComponent } from './features/chat/chat';
import { NavbarComponent } from './shared/navbar.component';
import { IntroComponent } from './shared/intro/intro';
import { ApiWarmingService } from './core/services/api-warming.service';
import { AnalyticsService } from './core/services/analytics.service';
import { ThemeService } from './core/services/theme.service';

import { AnalyticsDashboardComponent } from './shared/analytics-dashboard/analytics-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, NavbarComponent, IntroComponent, CommonModule, AnalyticsDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio-fullstack');
  private warmingService = inject(ApiWarmingService);
  public analytics = inject(AnalyticsService);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  
  showIntro = true;
  snowflakes = new Array(50).fill(0);

  constructor() {
    this.trackNavigation();
  }

  ngOnInit(): void {
    // Despertamos las APIs de forma silenciosa al arrancar
    this.warmingService.warmUpAll();
  }

  private trackNavigation(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEvent = event as NavigationEnd;
      // Normalizamos la URL: quitamos query params, la barra inicial y pasamos a MAYÚSCULAS
      let cleanUrl = navEvent.urlAfterRedirects.split('?')[0];
      if (cleanUrl.startsWith('/')) cleanUrl = cleanUrl.substring(1);
      
      this.analytics.trackPageView(cleanUrl.toUpperCase() || 'HOME');
    });
  }

  onIntroFinished() {
    this.showIntro = false;
  }
}

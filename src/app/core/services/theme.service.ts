import { inject, Injectable, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme, IThemeService } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements IThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  
  // Signal to hold theme state (SRP: encapsulation of state)
  private readonly themeSignal = signal<Theme>('light-moon');
  
  // Read-only computed signals (OCP: exposed for external components without direct modification rights)
  public readonly currentTheme = computed(() => this.themeSignal());
  public readonly isDark = computed(() => this.themeSignal() === 'dark');
  public readonly isLightMoon = computed(() => this.themeSignal() === 'light-moon');

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('user-theme') as Theme;
      if (savedTheme === 'light-moon' || savedTheme === 'dark') {
        this.themeSignal.set(savedTheme);
      }
      this.applyTheme(this.themeSignal());
    }
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.themeSignal() === 'dark' ? 'light-moon' : 'dark';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user-theme', theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const root = document.documentElement;
    if (theme === 'light-moon') {
      root.classList.add('light-moon-theme');
    } else {
      root.classList.remove('light-moon-theme');
    }
  }
}

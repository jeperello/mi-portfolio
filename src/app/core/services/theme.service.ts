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
  private readonly darkThemeSound = 'assets/sound/styles/Pulsar-Dark.mp3';
  private readonly lightThemeSound = 'assets/sound/styles/Densit-Light.mp3';
  private activeThemeSound?: HTMLAudioElement;
  public readonly soundEnabled = signal(true);
  public readonly isSoundPlaying = signal(false);
  
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
    this.playThemeSound(newTheme);
  }

  public toggleSound(): void {
    const enabled = !this.soundEnabled();
    this.soundEnabled.set(enabled);

    if (!enabled) {
      this.activeThemeSound?.pause();
      this.isSoundPlaying.set(false);
      return;
    }

    if (this.activeThemeSound?.paused) {
      this.activeThemeSound.play().catch(() => undefined);
    }
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

  private playThemeSound(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId) || !this.soundEnabled()) return;

    this.activeThemeSound?.pause();
    this.isSoundPlaying.set(false);
    this.activeThemeSound?.removeAttribute('src');
    this.activeThemeSound?.load();

    const sound = new Audio(theme === 'dark' ? this.darkThemeSound : this.lightThemeSound);
    this.activeThemeSound = sound;
    sound.addEventListener('play', () => this.isSoundPlaying.set(true));
    sound.addEventListener('pause', () => this.isSoundPlaying.set(false));
    sound.addEventListener('ended', () => this.isSoundPlaying.set(false));
    sound.play().catch(() => this.isSoundPlaying.set(false));
  }
}

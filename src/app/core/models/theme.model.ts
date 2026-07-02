export type Theme = 'dark' | 'light-moon';

export interface IThemeService {
  currentTheme: () => Theme;
  isDark: () => boolean;
  isLightMoon: () => boolean;
  toggleTheme(): void;
  setTheme(theme: Theme): void;
}

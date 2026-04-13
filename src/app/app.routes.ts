import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Ruta principal que muestra el showcase de proyectos
    path: '',
    loadComponent: () => import('./features/project-showcase/project-showcase.component').then(m => m.ProjectShowcaseComponent),
    title: 'Portafolio de Jorge'
  },
  {
    // Ruta para la demostración de la API reactiva
    path: 'show-api-reactive',
    loadComponent: () => import('./features/show-api-reactive/show-api-reactive.component').then(m => m.ShowApiReactiveComponent),
    title: 'Demo API Reactiva'
  },
  {
    // Ruta para la demostración de la API de hilos
    path: 'show-threads-api',
    loadComponent: () => import('./features/show-threads-api/show-threads-api.component').then(m => m.ShowThreadsApiComponent),
    title: 'Hilos virtuales VS Hilos de plataformas'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about-me/about-me.component').then(m => m.AboutMeComponent),
    title: 'Sobre Mí'
  }
];

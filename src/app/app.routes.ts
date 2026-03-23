import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Ruta principal que muestra el showcase de proyectos
    path: '',
    loadComponent: () => import('./features/project-showcase/project-showcase.component').then(m => m.ProjectShowcaseComponent),
    title: 'Portafolio'
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
    title: 'Demo API de Hilos'
  }
];

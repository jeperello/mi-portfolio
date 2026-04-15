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
    // Ruta para el Smart Batch Reprocessing
    path: 'smart-batch',
    loadComponent: () => import('./features/show-smart-batch/show-smart-batch.component').then(m => m.ShowSmartBatchComponent),
    title: 'Smart Batch Reprocessing'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about-me/about-me.component').then(m => m.AboutMeComponent),
    title: 'Sobre Mí'
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent),
    title: 'Mi Blog'
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./features/blog/blog-post.component').then(m => m.BlogPostComponent),
    title: 'Post del Blog'
  }
];

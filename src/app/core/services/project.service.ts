import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // En el futuro, estos datos vendrán de una API.
  // Por ahora, los mantenemos aquí para desarrollar la UI.
  private projects: Project[] = [
    {
      name: 'API Reactiva con Spring WebFlux',
      description: 'Una API REST reactiva construida con Java 21 y Spring Boot 3, utilizando programación funcional y comunicación no bloqueante para un alto rendimiento.',
      repositoryUrl: 'https://github.com/jeperello/reactive-api',
      technologies: [
        'Java 21',
        'Spring WebFlux',
        'Spring Data R2DBC',
        'H2 Database',
        'Lombok',
        'JUnit 5',
        'Docker',
        'GitHub Actions'
      ],
      demoUrl: '/show-api-reactive'
    },
    {
      name: 'Virtual Threads vs Hilos Tradicionales',
      description: 'Este proyecto es un sistema de ingesta de logs de alta concurrencia diseñado para comparar el rendimiento de los Virtual Threads (Project Loom) frente a los hilos de plataforma tradicionales.',
      repositoryUrl: 'https://github.com/jeperello/log-ingestion-engin',
      technologies: [
        'Java 21',
        'Lombok',
        'JUnit 5',
        'Docker',
        'Virtual Threads',
        'GitHub Actions: CI/CD',
        'Producer-Consumer Pattern',

      ],
      demoUrl: '/show-threads-api'
    },
    {
      name: 'Batch de Reprocesamiento Inteligente',
      description: 'Sistema backend de alto rendimiento desarrollado con Java 21, Spring Boot 3.4 y Spring Batch 5, diseñado para el procesamiento masivo de operaciones con resiliencia, manejo de estados e idempotencia.',
      repositoryUrl: 'https://github.com/jeperello/smart-reprocessing-batch',
      technologies: [
        'Java 21',
        'Lombok',
        'JUnit 5',
        'Docker',
        'Spring Batch', 'Spring Data JPA',
        'GitHub Actions: CI/CD',
        'DB H2 en memoria',

      ],
      demoUrl: ''
      //demoUrl: 'smart-batch'
    }
  ];

  constructor() { }

  /**
   * Devuelve un listado de todos los proyectos del portafolio.
   * @returns Un Observable con un arreglo de Proyectos.
   */
  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }
}

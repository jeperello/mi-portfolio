import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-showcase',
  standalone: true, // Marcamos el componente como Standalone
  imports: [CommonModule], // CommonModule nos da acceso a *ngFor, *ngIf, async pipe, etc.
  templateUrl: './project-showcase.component.html', // Ruta actualizada
  styleUrls: ['./project-showcase.component.scss'] // Ruta actualizada
})
export class ProjectShowcaseComponent implements OnInit {

  // Usamos el sufijo $ para indicar que es un Observable
  public projects$: Observable<Project[]> = of([]);

  // Inyectamos nuestro servicio de proyectos en el constructor
  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    // Al iniciar el componente, pedimos los proyectos al servicio
    this.projects$ = this.projectService.getProjects();
  }

}

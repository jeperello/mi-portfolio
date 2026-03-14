import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-showcase',
  standalone: true, // Marcamos el componente como Standalone
  imports: [CommonModule, RouterLink], // CommonModule nos da acceso a *ngFor, *ngIf, async pipe, etc.
  templateUrl: './project-showcase.component.html', // Ruta actualizada
  styleUrls: ['./project-showcase.component.scss'] // Ruta actualizada
})
export class ProjectShowcaseComponent {

  // Usamos el sufijo $ para indicar que es un Observable
  public projects$: Observable<Project[]>;

  // Inyectamos nuestro servicio de proyectos en el constructor
  constructor(private projectService: ProjectService) {
    this.projects$ = this.projectService.getProjects();
  }

}

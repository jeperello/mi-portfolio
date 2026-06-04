import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { Router, RouterLink } from '@angular/router';
import { AnalyticsDirective } from '../../shared/analytics.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-project-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink, AnalyticsDirective],
  templateUrl: './project-showcase.component.html',
  styleUrls: ['./project-showcase.component.scss']
})
export class ProjectShowcaseComponent {
  private projectService = inject(ProjectService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);
  
  // Convertimos el observable a signal para mejor ergonomía
  public allProjects = toSignal(this.projectService.getProjects(), { initialValue: [] });
  
  // Estado del carrusel
  public currentIndex = signal(0);
  public itemsPerPage = 2;

  // Pasos totales posibles para los indicadores
  public totalSteps = computed(() => {
    const total = this.allProjects().length;
    return Math.max(0, total - this.itemsPerPage + 1);
  });

  // Proyectos visibles calculados reactivamente
  public visibleProjects = computed(() => {
    const projects = this.allProjects();
    const start = this.currentIndex();
    return projects.slice(start, start + this.itemsPerPage);
  });

  public next() {
    if (this.canNext()) {
      this.currentIndex.update(v => v + 1);
    }
  }

  public prev() {
    if (this.canPrev()) {
      this.currentIndex.update(v => v - 1);
    }
  }

  public canNext = computed(() => this.currentIndex() < this.totalSteps() - 1);
  public canPrev = computed(() => this.currentIndex() > 0);

  public handleDemo(project: Project) {
    if (project.demoUrl === 'OPEN_DASHBOARD') {
      this.analyticsService.openDashboard();
    } else if (project.demoUrl) {
      this.router.navigate([project.demoUrl]);
    }
  }
}

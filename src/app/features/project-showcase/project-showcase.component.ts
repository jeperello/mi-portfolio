import { afterNextRender, ChangeDetectionStrategy, Component, signal, computed, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { Router } from '@angular/router';
import { AnalyticsDirective } from '../../shared/analytics.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-project-showcase',
  standalone: true,
  imports: [CommonModule, AnalyticsDirective],
  templateUrl: './project-showcase.component.html',
  styleUrls: ['./project-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectShowcaseComponent {
  private projectService = inject(ProjectService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);
  
  // Convertimos el observable a signal para mejor ergonomía
  public allProjects = toSignal(this.projectService.getProjects(), { initialValue: [] });
  
  // Estado del carrusel
  public currentIndex = signal(0);
  public itemsPerPage = signal(2);

  constructor() {
    afterNextRender(() => this.updateItemsPerPage());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerPage();
  }

  private updateItemsPerPage(): void {
    if (typeof window === 'undefined') return;
    // Si la pantalla es menor a 1024px (donde el CSS ya cambia a 1 columna), mostramos solo 1
    const newItemsPerPage = window.innerWidth < 1024 ? 1 : 2;
    
    if (this.itemsPerPage() !== newItemsPerPage) {
      this.itemsPerPage.set(newItemsPerPage);
      // Resetear el índice si es necesario para evitar quedar fuera de rango
      this.currentIndex.set(0);
    }
  }

  // Pasos totales posibles para los indicadores
  public totalSteps = computed(() => {
    const total = this.allProjects().length;
    return Math.max(0, total - this.itemsPerPage() + 1);
  });

  // Proyectos visibles calculados reactivamente
  public visibleProjects = computed(() => {
    const projects = this.allProjects();
    const start = this.currentIndex();
    return projects.slice(start, start + this.itemsPerPage());
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

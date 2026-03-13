import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectShowcaseComponent } from './features/project-showcase/project-showcase.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProjectShowcaseComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-fullstack');
}

import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from '../../core/models/blog.model';
import { BlogService } from '../../core/services/blog.service';
import { RouterLink } from '@angular/router';
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ApiWarmingComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  public blogs = signal<Blog[] | null>(null);
  public isWarming = signal<boolean>(false);

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Si en 800ms no hay respuesta, mostramos el mensaje de calentamiento
    const warmingTimeout = setTimeout(() => {
      this.isWarming.set(true);
    }, 800);

    this.blogService.getBlogs().subscribe({
      next: (data) => {
        clearTimeout(warmingTimeout);
        this.blogs.set(data);
        this.isWarming.set(false);
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        clearTimeout(warmingTimeout);
        this.isWarming.set(false);
        this.blogs.set([]); // Mostrar vacío o backup (el servicio ya debería dar backup)
      }
    });
  }
}

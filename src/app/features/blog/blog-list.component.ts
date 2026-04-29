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
  public isWarming = signal(true); // Iniciamos con la tasita

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // La tasita se queda por 3 segundos
    setTimeout(() => {
      this.isWarming.set(false);
    }, 3000);

    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs.set(data);
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.blogs.set([]); // Mostrar vacío o backup (el servicio ya debería dar backup)
      }
    });
  }
}

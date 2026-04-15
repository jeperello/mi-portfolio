import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Blog } from '../../core/models/blog.model';
import { BlogService } from '../../core/services/blog.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {
  public blogs$: Observable<Blog[]>;

  constructor(private blogService: BlogService) {
    this.blogs$ = this.blogService.getBlogs();
  }
}

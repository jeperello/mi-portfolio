import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Blog } from '../../core/models/blog.model';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  public blog$: Observable<Blog | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.blog$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.blogService.getBlogById(id || '');
      })
    );
  }
}

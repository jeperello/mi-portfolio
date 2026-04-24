import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap, tap, BehaviorSubject, of } from 'rxjs';
import { Blog, BlogComment } from '../../core/models/blog.model';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  public blog$: Observable<Blog | undefined> | undefined;
  public comments$ = new BehaviorSubject<BlogComment[]>([]);
  public commentForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      author: [''],
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.blog$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.blogService.getBlogById(id || '');
      }),
      tap(blog => {
        if (blog) {
          this.loadComments();
        }
      })
    );
  }

  private loadComments(): void {
    this.blogService.getComments().subscribe({
      next: (comments) => this.comments$.next(comments),
      error: (err) => console.error('Error cargando comentarios:', err)
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const newComment = {
        username: this.commentForm.value.author?.trim() || 'Anonymus',
        content: this.commentForm.value.content
      };

      this.blogService.addComment(newComment).subscribe({
        next: () => {
          this.loadComments();
          this.commentForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error al publicar comentario:', err);
          this.isSubmitting = false;
          alert('Ups! No se pudo publicar el comentario. ¿Estará el servidor de Java tomando un café? ☕');
        }
      });
    }
  }
}

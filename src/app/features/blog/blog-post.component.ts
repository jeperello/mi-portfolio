import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog, BlogComment } from '../../core/models/blog.model';
import { BlogService } from '../../core/services/blog.service';
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, ApiWarmingComponent],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  public blog = signal<Blog | undefined | null>(null);
  public comments = signal<BlogComment[]>([]);
  public commentForm: FormGroup;
  public isSubmitting = false;
  public isWarming = signal<boolean>(false);
  private currentBlogId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.commentForm = this.fb.group({
      author: [''],
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const warmingTimeout = setTimeout(() => {
      this.isWarming.set(true);
    }, 800);

    this.route.paramMap.subscribe(params => {
      this.currentBlogId = params.get('id');
      if (this.currentBlogId) {
        this.blogService.getBlogById(this.currentBlogId).subscribe({
          next: (blog) => {
            clearTimeout(warmingTimeout);
            this.blog.set(blog);
            this.isWarming.set(false);
            if (blog) {
              this.loadComments(this.currentBlogId!);
            }
          },
          error: (err) => {
            console.error('Error loading blog:', err);
            clearTimeout(warmingTimeout);
            this.blog.set(undefined);
            this.isWarming.set(false);
          }
        });
      }
    });
  }

  private loadComments(postId: string): void {
    this.blogService.getComments(postId).subscribe({
      next: (comments) => this.comments.set(comments),
      error: (err) => console.error('Error cargando comentarios:', err)
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && !this.isSubmitting && this.currentBlogId) {
      this.isSubmitting = true;
      const newComment = {
        username: this.commentForm.value.author?.trim() || 'Anónimo con Prisa',
        content: this.commentForm.value.content
      };

      this.blogService.addComment(this.currentBlogId, newComment).subscribe({
        next: () => {
          if (this.currentBlogId) this.loadComments(this.currentBlogId);
          this.commentForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error al publicar comentario:', err);
          this.isSubmitting = false;
          alert('¡Epa! No pudimos enviar tu sabiduría al servidor. ¿Estará la base de datos de Java meditando? 🧘‍♂️');
        }
      });
    }
  }
}

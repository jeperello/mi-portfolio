import { Component, AfterViewInit, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './about-me.html',
  styleUrls: ['./about-me.scss']
})
export class AboutMeComponent implements AfterViewInit {
  private el = inject(ElementRef);
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);

  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit(): void {
    // Configuramos el observador
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((reveal: HTMLElement) => observer.observe(reveal));
  }

  onSubmitContact(): void {
    if (this.contactForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.submitSuccess.set(false);
      this.submitError.set(false);

      const { email, message } = this.contactForm.value;

      this.blogService.sendContactMessage(email, message).subscribe({
        next: () => {
          this.submitSuccess.set(true);
          this.contactForm.reset();
          this.isSubmitting.set(false);
          // Ocultar mensaje de éxito después de 5 segundos
          setTimeout(() => this.submitSuccess.set(false), 5000);
        },
        error: (err) => {
          console.error('Error al enviar mensaje de contacto:', err);
          this.submitError.set(true);
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
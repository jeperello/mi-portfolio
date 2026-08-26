import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../core/services/blog.service';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
        provideRouter([]),
        {
          provide: BlogService,
          useValue: {
            getBlogs: () =>
              of([
                {
                  id: '2',
                  title: 'Spring MVC vs WebFlux vs Virtual Threads',
                  excerpt: 'Comparativa de concurrencia en Spring.',
                  content: '',
                  date: '15 de abril de 2026',
                  author: 'Jorge Perello',
                  tags: ['Spring Boot', 'WebFlux', 'Virtual Threads', 'Java 21'],
                  imageCard: 'assets/blog/comparativa.png',
                },
              ]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render a card image when imageCard is defined', () => {
    fixture.detectChanges();
    // Avanzamos 250ms para que termine isWarming timeout
    vi.advanceTimersByTime(250);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.blog-card-image');

    expect(component).toBeTruthy();
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('comparativa.png');
  });
});


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../core/services/blog.service';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
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

  it('should render a card image when imageCard is defined', fakeAsync(() => {
    fixture.detectChanges();
    tick(200);
    tick(500);
    tick(5000);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(component).toBeTruthy();
    expect(img).toBeTruthy();
    expect(img.src).toContain('comparativa.png');
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectShowcaseComponent } from './project-showcase.component';

describe('ProjectShowcaseComponent', () => {
  let component: ProjectShowcaseComponent;
  let fixture: ComponentFixture<ProjectShowcaseComponent>;

  beforeEach(async () => {
    sessionStorage.removeItem('portfolio-project-showcase-index');

    await TestBed.configureTestingModule({
      imports: [ProjectShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectShowcaseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should restore the last carousel position after returning to the projects page', async () => {
    sessionStorage.setItem('portfolio-project-showcase-index', '1');

    const restoredFixture = TestBed.createComponent(ProjectShowcaseComponent);
    const restoredComponent = restoredFixture.componentInstance;
    await restoredFixture.whenStable();

    expect(restoredComponent.currentIndex()).toBe(1);
  });

  it('should persist the carousel position when moving to the next project', () => {
    component.next();

    expect(sessionStorage.getItem('portfolio-project-showcase-index')).toBe('1');
  });
});

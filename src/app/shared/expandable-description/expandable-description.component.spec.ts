import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandableDescriptionComponent } from './expandable-description.component';
import { Component, ComponentRef } from '@angular/core';

describe('ExpandableDescriptionComponent', () => {
  let component: ExpandableDescriptionComponent;
  let componentRef: ComponentRef<ExpandableDescriptionComponent>;
  let fixture: ComponentFixture<ExpandableDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableDescriptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableDescriptionComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('label', 'Ver detalles de la API');
    componentRef.setInput('expandedLabel', 'Ocultar detalles');
    componentRef.setInput('text', 'Descripción técnica de la arquitectura de la API.');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be collapsed by default', () => {
    expect(component.isExpanded()).toBe(false);
    const button = fixture.nativeElement.querySelector('.expandable-toggle-btn');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toContain('Ver detalles de la API');
    const drawer = fixture.nativeElement.querySelector('.expandable-drawer');
    expect(drawer.classList.contains('open')).toBe(false);
  });

  it('should toggle expansion state on click', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.expandable-toggle-btn');
    button.click();
    fixture.detectChanges();

    expect(component.isExpanded()).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.textContent).toContain('Ocultar detalles');
    const drawer = fixture.nativeElement.querySelector('.expandable-drawer');
    expect(drawer.classList.contains('open')).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(component.isExpanded()).toBe(false);
    expect(button.textContent).toContain('Ver detalles de la API');
  });

  it('should display text input inside description drawer', () => {
    const textElement = fixture.nativeElement.querySelector('.description-text');
    expect(textElement.textContent).toContain('Descripción técnica de la arquitectura de la API.');
  });
});

@Component({
  standalone: true,
  imports: [ExpandableDescriptionComponent],
  template: `
    <app-expandable-description>
      <button actions class="custom-action-btn">Action Button</button>
      <p class="custom-content">Body Content</p>
    </app-expandable-description>
  `
})
class TestHostComponent {}

describe('ExpandableDescriptionComponent Projection', () => {
  it('should project actions into header bar and content into drawer', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const actionBtn = fixture.nativeElement.querySelector('.expandable-header-bar .custom-action-btn');
    expect(actionBtn).toBeTruthy();
    expect(actionBtn.textContent).toContain('Action Button');

    const drawerContent = fixture.nativeElement.querySelector('.drawer-content .custom-content');
    expect(drawerContent).toBeTruthy();
    expect(drawerContent.textContent).toContain('Body Content');
  });
});


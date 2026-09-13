import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ReactiveApiService } from '../../core/services/reactive-api.service';
import { ModalService } from '../../shared/modal';
import { ShowApiReactiveComponent } from './show-api-reactive.component';

describe('ShowApiReactiveComponent', () => {
  let fixture: ComponentFixture<ShowApiReactiveComponent>;
  let component: ShowApiReactiveComponent;

  const modalService = {
    open: vi.fn(),
  };

  const reactiveApiService = {
    getMetricsStream: vi.fn(() => EMPTY),
    getTechnologiesStream: vi.fn(() => of({ description: 'Tecnología mock' })),
    getAdvantagesStream: vi.fn(() => of({ description: 'Ventaja mock' })),
  };

  beforeEach(async () => {
    modalService.open.mockClear();
    reactiveApiService.getMetricsStream.mockClear();
    reactiveApiService.getTechnologiesStream.mockClear();
    reactiveApiService.getAdvantagesStream.mockClear();

    await TestBed.configureTestingModule({
      imports: [ShowApiReactiveComponent],
      providers: [
        provideRouter([]),
        { provide: ReactiveApiService, useValue: reactiveApiService },
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowApiReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render technology load rows after simulating load', () => {
    component.simulateTechnologiesLoad();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.technology-panel .load-result-row');

    expect(rows.length).toBe(component.numberOfConcurrentRequests);
    expect(rows[0].textContent).toContain('Tecnología mock');
  });

  it('should render advantage load rows after simulating load', () => {
    component.simulateAdvantagesLoad();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.advantages-panel .load-result-row');

    expect(rows.length).toBe(component.numberOfConcurrentRequests);
    expect(rows[0].textContent).toContain('Ventaja mock');
  });
});

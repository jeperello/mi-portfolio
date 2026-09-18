import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the memory usage percentage within valid bounds', () => {
    expect(component.memoryUsagePercentage({ usedMemoryMB: 128, freeMemoryMB: 384, totalMemoryMB: 512 })).toBe(25);
    expect(component.memoryUsagePercentage({ usedMemoryMB: 900, freeMemoryMB: 0, totalMemoryMB: 512 })).toBe(100);
    expect(component.memoryUsagePercentage({ usedMemoryMB: 128, freeMemoryMB: 384, totalMemoryMB: 0 })).toBe(0);
  });

  it('should explain the ten-request simulation independently', () => {
    component.simulateTechnologiesLoad();
    fixture.detectChanges();

    const explanation = fixture.nativeElement.querySelector('.technology-panel .panel-explanation');

    expect(explanation).not.toBeNull();
    expect(explanation.textContent).toContain('10 veces');
    expect(explanation.textContent).toContain('conexión reactiva');
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

  it('should scroll to the technologies panel when simulating technologies load', () => {
    const technologiesPanel = component.technologiesPanel?.nativeElement as HTMLElement & {
      scrollIntoView?: () => void;
    };

    technologiesPanel.scrollIntoView = vi.fn();

    component.simulateTechnologiesLoad();
    fixture.detectChanges();

    expect(technologiesPanel.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('should scroll to the advantages panel when simulating advantages load', () => {
    const advantagesPanel = component.advantagesPanel?.nativeElement as HTMLElement & {
      scrollIntoView?: () => void;
    };

    advantagesPanel.scrollIntoView = vi.fn();

    component.simulateAdvantagesLoad();
    fixture.detectChanges();

    expect(advantagesPanel.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('should hide panels and display warming component when isWarming is true', () => {
    component.isWarming.set(true);
    fixture.detectChanges();

    const warming = fixture.nativeElement.querySelector('app-api-warming');
    const metricsRow = fixture.nativeElement.querySelector('.metrics-row');
    const panelActions = fixture.nativeElement.querySelectorAll('.panel-actions');
    const infoGrid = fixture.nativeElement.querySelector('.info-grid');

    expect(warming).toBeTruthy();
    expect(metricsRow).toBeNull();
    expect(panelActions.length).toBe(0);
    expect(infoGrid).toBeNull();
  });

  it('should display panels and hide warming component when isWarming is false', () => {
    component.isWarming.set(false);
    fixture.detectChanges();

    const warming = fixture.nativeElement.querySelector('app-api-warming');
    const metricsRow = fixture.nativeElement.querySelector('.metrics-row');
    const panelActions = fixture.nativeElement.querySelectorAll('.panel-actions');
    const infoGrid = fixture.nativeElement.querySelector('.info-grid');

    expect(warming).toBeNull();
    expect(metricsRow).toBeTruthy();
    expect(panelActions.length).toBe(2);
    expect(infoGrid).toBeTruthy();
  });
});

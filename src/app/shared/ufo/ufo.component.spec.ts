import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UfoComponent } from './ufo.component';
import { AnalyticsService } from '../../core/services/analytics.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('UfoComponent', () => {
  let component: UfoComponent;
  let fixture: ComponentFixture<UfoComponent>;

  const mockAnalyticsService = {
    trackEvent: vi.fn(),
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    mockAnalyticsService.trackEvent.mockClear();

    await TestBed.configureTestingModule({
      imports: [UfoComponent],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con trayectoria 1, 0 impactos y HUD oculto por defecto', () => {
    expect(component.trajectoryIndex()).toBe(1);
    expect(component.isAlarmed()).toBe(false);
    expect(component.hitCount()).toBe(0);
    expect(component.isCrashing()).toBe(false);
    expect(component.showParatrooper()).toBe(false);
    expect(component.isRespawning()).toBe(false);
    expect(component.isHudVisible()).toBe(false);
    expect(component.hudStatusLabel()).toBe('TARGET READY');
    expect(component.controlButtonLabel()).toBe('STOP');
    expect(fixture.nativeElement.querySelector('.ufo-hud-toggle.collapsed')).not.toBeNull();
  });

  it('debe alternar el control del OVNI entre STOP y RESTART y registrar métricas', () => {
    expect(component.controlButtonLabel()).toBe('STOP');

    component.onControlButtonClick();

    expect(component.isStopped()).toBe(true);
    expect(component.controlButtonLabel()).toBe('RESTART');
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('CLICK', 'UFO-STOP', expect.any(Object));

    component.onControlButtonClick();

    expect(component.isStopped()).toBe(false);
    expect(component.hitCount()).toBe(0);
    expect(component.controlButtonLabel()).toBe('STOP');
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('CLICK', 'UFO-RESTART', expect.any(Object));
  });

  it('debe registrar el primer impacto (1/3), emitir evento de disparo, mostrar queja y reanudar el vuelo tras 3.5s', () => {
    const mockEvent = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');

    component.onUfoClick(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(component.hitCount()).toBe(1);
    expect(component.isAlarmed()).toBe(true);
    expect(component.hudStatusLabel()).toBe('SHIELD 66%');
    expect(component.message()).not.toBeNull();
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('CLICK', 'UFO-SHOT', {
      hit: 1,
      maxHits: 3,
      isCrash: false
    });

    // Avanzamos el timer de lectura del mensaje
    vi.advanceTimersByTime(3600);
    expect(component.isAlarmed()).toBe(false);
    expect(component.message()).toBeNull();
  });

  it('debe registrar el segundo impacto (2/3) y actualizar el HUD a SHIELD 33%', () => {
    component.onUfoClick(new MouseEvent('click')); // 1
    component.onUfoClick(new MouseEvent('click')); // 2

    expect(component.hitCount()).toBe(2);
    expect(component.hudStatusLabel()).toBe('SHIELD 33%');
    expect(component.isCrashing()).toBe(false);
  });

  it('debe renderizar el paracaidista dentro del OVNI cuando el alien sale al alcanzar 3/3 impactos', () => {
    component.onUfoClick(new MouseEvent('click')); // 1
    component.onUfoClick(new MouseEvent('click')); // 2
    component.onUfoClick(new MouseEvent('click')); // 3

    expect(component.showParatrooper()).toBe(false);

    vi.advanceTimersByTime(400);
    fixture.detectChanges();

    expect(component.showParatrooper()).toBe(true);

    const wrapper = fixture.nativeElement.querySelector('.ufo-wrapper');
    expect(wrapper).not.toBeNull();
    expect(wrapper.querySelector('.alien-paratrooper')).not.toBeNull();
  });

  it('debe activar la secuencia de caída cómica, eyección y descenso ultra lento del paracaidista al alcanzar 3/3 impactos', () => {
    component.onUfoClick(new MouseEvent('click')); // 1
    component.onUfoClick(new MouseEvent('click')); // 2
    component.onUfoClick(new MouseEvent('click')); // 3

    expect(component.hitCount()).toBe(3);
    expect(component.isCrashing()).toBe(true);
    expect(component.controlButtonLabel()).toBe('RESTART');
    expect(component.hudStatusLabel()).toBe('CRITICAL DAMAGE!');
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('CLICK', 'UFO-CRASH', {
      totalHits: 3
    });

    // El marciano salta en paracaídas a los 300ms
    vi.advanceTimersByTime(400);
    expect(component.showParatrooper()).toBe(true);

    // El OVNI termina su caída rápida a los 4.6s y pasa a respawn;
    // el alien sigue activo durante ese tramo y desaparece luego con la secuencia completa.
    vi.advanceTimersByTime(4300);
    expect(component.isCrashing()).toBe(false);
    expect(component.isRespawning()).toBe(true);
    expect(component.showParatrooper()).toBe(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.saucer-ship')).toBeNull();
    expect(fixture.nativeElement.querySelector('.alien-paratrooper')).not.toBeNull();

    // El paracaidista termina su descenso suave y lineal a los 11s
    vi.advanceTimersByTime(6500);
    expect(component.showParatrooper()).toBe(false);
    expect(component.isRespawning()).toBe(false);
    expect(component.isStopped()).toBe(true);
    expect(component.controlButtonLabel()).toBe('RESTART');
    expect(component.hudStatusLabel()).toBe('CRITICAL DAMAGE!');
  });
});

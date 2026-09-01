import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UfoComponent } from './ufo.component';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('UfoComponent', () => {
  let component: UfoComponent;
  let fixture: ComponentFixture<UfoComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [UfoComponent]
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

  it('debe inicializar con trayectoria 1, 0 impactos y HUD en estado listo', () => {
    expect(component.trajectoryIndex()).toBe(1);
    expect(component.isAlarmed()).toBe(false);
    expect(component.hitCount()).toBe(0);
    expect(component.isCrashing()).toBe(false);
    expect(component.isRespawning()).toBe(false);
    expect(component.hudStatusLabel()).toBe('TARGET READY');
  });

  it('debe registrar el primer impacto (1/3), mostrar queja y reanudar el vuelo tras 3.5s', () => {
    const mockEvent = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');

    component.onUfoClick(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(component.hitCount()).toBe(1);
    expect(component.isAlarmed()).toBe(true);
    expect(component.hudStatusLabel()).toBe('SHIELD 66%');
    expect(component.message()).not.toBeNull();

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

  it('debe activar la secuencia de caída cómica y suave al alcanzar 3/3 impactos', () => {
    component.onUfoClick(new MouseEvent('click')); // 1
    component.onUfoClick(new MouseEvent('click')); // 2
    component.onUfoClick(new MouseEvent('click')); // 3

    expect(component.hitCount()).toBe(3);
    expect(component.isCrashing()).toBe(true);
    expect(component.hudStatusLabel()).toBe('CRITICAL DAMAGE!');

    // 1. Termina el descenso y entra en taller de reparación
    vi.advanceTimersByTime(4700);
    expect(component.isCrashing()).toBe(false);
    expect(component.isRespawning()).toBe(true);

    // 2. Tras 10s se repara y vuelve listo para otra ronda (0/3)
    vi.advanceTimersByTime(10100);
    expect(component.hitCount()).toBe(0);
    expect(component.isRespawning()).toBe(false);
    expect(component.hudStatusLabel()).toBe('TARGET READY');
  });
});

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

  it('debe inicializar con la trayectoria 1 y sin estar alarmado', () => {
    expect(component.trajectoryIndex()).toBe(1);
    expect(component.isAlarmed()).toBe(false);
    expect(component.message()).toBeNull();
  });

  it('debe reaccionar al click pausándose en el lugar, activando luces de alarma y mostrando el diálogo', () => {
    const mockEvent = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');

    component.onUfoClick(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(component.isAlarmed()).toBe(true);
    expect(component.message()).not.toBeNull();
    expect(component.isBeamActive()).toBe(false);

    // Avanzamos el timer de lectura del mensaje
    vi.advanceTimersByTime(3600);
    expect(component.isAlarmed()).toBe(false);
    expect(component.message()).toBeNull();
  });
});

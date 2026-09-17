import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReactiveApiService } from './reactive-api.service';

class MockEventSource {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  static instances: MockEventSource[] = [];
  url: string;
  readyState = MockEventSource.CONNECTING;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  close = vi.fn().mockImplementation(() => {
    this.readyState = MockEventSource.CLOSED;
  });

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  simulateMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  simulateError(error: any = new Event('error')): void {
    if (this.onerror) {
      this.onerror(error);
    }
  }
}

describe('ReactiveApiService', () => {
  let service: ReactiveApiService;
  const originalEventSource = globalThis.EventSource;

  beforeEach(() => {
    MockEventSource.instances = [];
    (globalThis as any).EventSource = MockEventSource;

    TestBed.configureTestingModule({
      providers: [ReactiveApiService]
    });
    service = TestBed.inject(ReactiveApiService);
  });

  afterEach(() => {
    (globalThis as any).EventSource = originalEventSource;
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should complete a finite stream when server closes the connection after sending data', () => {
    let receivedData: any = null;
    let completed = false;
    let errorOccurred: any = null;

    const subscription = service.getTechnologiesStream().subscribe({
      next: data => {
        receivedData = data;
      },
      error: err => {
        errorOccurred = err;
      },
      complete: () => {
        completed = true;
      }
    });

    expect(MockEventSource.instances.length).toBe(1);
    const eventSourceInstance = MockEventSource.instances[0];
    expect(eventSourceInstance.url).toContain('/api/technologies');

    // Emitir mensaje desde el backend
    eventSourceInstance.simulateMessage({ description: 'Java 21 LTS' });
    expect(receivedData).toEqual({ description: 'Java 21 LTS' });

    // Cuando el servidor cierra la conexión HTTP, el navegador dispara onerror con readyState = CONNECTING (0)
    eventSourceInstance.simulateError();

    // Debe completar normalmente sin emitir error
    expect(completed).toBe(true);
    expect(errorOccurred).toBeNull();
    expect(eventSourceInstance.close).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should emit error on finite stream if connection fails before receiving any data', () => {
    let completed = false;
    let errorOccurred: any = null;

    const subscription = service.getTechnologiesStream().subscribe({
      next: () => {},
      error: err => {
        errorOccurred = err;
      },
      complete: () => {
        completed = true;
      }
    });

    const eventSourceInstance = MockEventSource.instances[0];

    // Simular error inmediato (ej. servidor caído / 500)
    const testError = new Event('error');
    eventSourceInstance.simulateError(testError);

    expect(completed).toBe(false);
    expect(errorOccurred).toBe(testError);
    expect(eventSourceInstance.close).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should close eventSource when unsubscribed', () => {
    const subscription = service.getAdvantagesStream().subscribe();
    const eventSourceInstance = MockEventSource.instances[0];

    expect(eventSourceInstance.url).toContain('/api/advantages');
    subscription.unsubscribe();

    expect(eventSourceInstance.close).toHaveBeenCalledTimes(1);
  });
});

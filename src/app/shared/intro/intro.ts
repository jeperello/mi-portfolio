import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-intro',
  standalone: true,
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroComponent implements OnInit, OnDestroy {
  public readonly isVisible = signal(true);
  public readonly finished = output<void>();

  private dismissTimer?: ReturnType<typeof setTimeout>;
  private completionTimer?: ReturnType<typeof setTimeout>;

  logs = [
    { message: 'Starting JVM...', type: 'info' },
    { message: 'Allocating Heap Memory (Xmx8G)...', type: 'info' },
    { message: 'Loading Spring Boot 3.2.0 Context...', type: 'info' },
    { message: 'Optimizing Virtual Threads (Project Loom)...', type: 'success' },
    { message: 'Initializing Reactive WebFlux Streams...', type: 'success' },
    { message: 'Warming up JIT Compiler...', type: 'warning' },
    { message: 'Brewing Arabica Coffee Beans...', type: 'info' },
    { message: 'Port 4200 (Angular) is listening.', type: 'success' },
    { message: 'SYSTEM READY. WELCOME GUEST.', type: 'success' },
    { message: '¡Bienvenido! Y gracias por pasar.', type: 'success' }
  ];

  ngOnInit(): void {
    // La intro es parte de la bienvenida, no una pantalla de carga: no debe retrasar el contenido.
    this.dismissTimer = setTimeout(() => this.dismiss(), 3200);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  public dismiss(): void {
    if (!this.isVisible()) return;

    this.clearTimers();
    this.isVisible.set(false);
    this.completionTimer = setTimeout(() => this.finished.emit(), 300);
  }

  private clearTimers(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    if (this.completionTimer) clearTimeout(this.completionTimer);
  }
}

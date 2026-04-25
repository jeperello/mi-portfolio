import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class IntroComponent implements OnInit {
  isVisible = true;
  @Output() finished = new EventEmitter<void>();

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

  ngOnInit() {
    // Después de 5.5 segundos empezamos el desvanecimiento
    setTimeout(() => {
      this.isVisible = false;
      // Esperamos 1 segundo más (el tiempo de la transición CSS) para avisar al padre
      setTimeout(() => this.finished.emit(), 1000);
    }, 5500);
  }
}

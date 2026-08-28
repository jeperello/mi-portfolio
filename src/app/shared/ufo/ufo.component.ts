import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ufo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ufo.component.html',
  styleUrl: './ufo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UfoComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private flightTimer: any;
  private messageTimer: any;

  // Estado reactivo con Signals
  trajectoryIndex = signal<number>(1);
  isAlarmed = signal<boolean>(false);
  isBeamActive = signal<boolean>(false);
  message = signal<string | null>(null);

  private readonly funnyQuotes = [
    '👽 Buscando señales de Java 21 en la Tierra...',
    '☕ Abduciendo café para el desarrollador...',
    '🛸 Error 404: Vaca no encontrada 🐄',
    '⚡ Escaneando APIs reactivas...',
    '👾 ¿Quién apagó el Garbage Collector?',
    '🛸 ¡Cuidado! Desplegando a producción en viernes...',
    '🚀 ¡Tus Virtual Threads me esquivaron por poco!',
    '🪐 ¡Saludos terrícola! Código 100% no bloqueante detectado.',
    '🛰️ Hackeando el satélite para darte una estrella en GitHub ⭐'
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startUfoCycle();
    }
  }

  ngOnDestroy(): void {
    if (this.flightTimer) clearTimeout(this.flightTimer);
    if (this.messageTimer) clearTimeout(this.messageTimer);
  }

  private startUfoCycle(): void {
    // Alterna trayectorias y activa el rayo de abducción periódicamente
    const scheduleNextFlight = () => {
      const nextDelay = 22000 + Math.random() * 10000; // Entre 22s y 32s
      this.flightTimer = setTimeout(() => {
        // Si no está alarmado con mensaje, cambiamos de trayectoria
        if (!this.isAlarmed()) {
          const nextTraj = (this.trajectoryIndex() % 3) + 1;
          this.trajectoryIndex.set(nextTraj);

          // Activa el rayo abductor en el medio del vuelo
          setTimeout(() => {
            if (!this.isAlarmed()) {
              this.isBeamActive.set(true);
              setTimeout(() => this.isBeamActive.set(false), 4500);
            }
          }, 6000);
        }

        scheduleNextFlight();
      }, nextDelay);
    };

    scheduleNextFlight();
  }

  // Interacción al hacer click sobre el OVNI
  onUfoClick(event: MouseEvent): void {
    event.stopPropagation();

    // Mensaje aleatorio
    const randomQuote = this.funnyQuotes[Math.floor(Math.random() * this.funnyQuotes.length)];
    this.message.set(randomQuote);
    this.isBeamActive.set(false);
    this.isAlarmed.set(true);

    if (this.messageTimer) clearTimeout(this.messageTimer);
    
    // Mantiene la pausa y el mensaje legible durante 3.5 segundos, luego retoma el vuelo suavemente
    this.messageTimer = setTimeout(() => {
      this.message.set(null);
      this.isAlarmed.set(false);
    }, 3500);
  }
}

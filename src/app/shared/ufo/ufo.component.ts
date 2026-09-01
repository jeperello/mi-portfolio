import { Component, ChangeDetectionStrategy, signal, computed, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
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
  private crashTimer: any;
  private respawnTimer: any;
  private glitchTimer: any;

  // Constantes de juego
  readonly maxHits = 3;

  // Estado reactivo con Signals
  trajectoryIndex = signal<number>(1);
  isAlarmed = signal<boolean>(false);
  isBeamActive = signal<boolean>(false);
  message = signal<string | null>(null);

  // Contador de impactos y estados de combate Arcade
  hitCount = signal<number>(0);
  isCrashing = signal<boolean>(false);
  isRespawning = signal<boolean>(false);
  hudGlitch = signal<boolean>(false);

  // Computed para estado legible en HUD
  hudStatusLabel = computed(() => {
    const hits = this.hitCount();
    if (hits === 0) return 'TARGET READY';
    if (hits === 1) return 'SHIELD 66%';
    if (hits === 2) return 'SHIELD 33%';
    return 'CRITICAL DAMAGE!';
  });

  // Frases cómicas habituales (vuelo libre)
  private readonly funnyQuotes = [
    '👽 Buscando señales de Java 21 en la Tierra...',
    '☕ Abduciendo café para el desarrollador...',
    '🛸 Error 404: Vaca no encontrada 🐄',
    '⚡ Escaneando APIs reactivas...',
    '👾 ¿Quién apagó el Garbage Collector?',
    '🛸 ¡Cuidado! Desplegando a producción en viernes...',
    '🚀 ¡Tus Virtual Threads me esquivaron por poco!',
    '🪐 ¡Saludos terrícola! Código 100% no bloqueante detectado.',
    '🛰️ Hackeando el satélite para darte una estrella en GitHub ⭐',
    '🛸 Jorge sera reportado.',
  ];

  // Frases cómicas cuando recibe impactos 1 y 2
  private readonly hitQuotes = [
    '💥 ¡Ouch! ¡Eso rozó mi reactor cuántico!',
    '🛡️ ¡Escudos al 66%! ¡Deja de dispararme con el cursor!',
    '🛸 ¡Alerta! ¡Impacto directo en el microservicio!',
    '☕ ¡Casi me derramas el café espacial!',
    '🎯 ¡Buen tiro! Pero mi algoritmo de evasión en Java es más rápido.',
    '👾 ¡Ey! ¿Acaso no leíste el README de paz intergaláctica?',
    '⚡ ¡Bajaste mi ancho de banda espacial! ¡Te veo en el próximo ping!',
  ];

  // Frases cómicas de Caída Tranqui / Aterrizaje Forzoso 3/3
  private readonly crashQuotes = [
    '🚨 ¡Houston, perdimos propulsión! ¡Aterrizaje de emergencia! 🛬💥',
    '⚡ ¡Puf... puf! El Garbage Collector me apagó el motor cuántico... 😵💨',
    '🛸 ¡Batería al 0%! Planeando hacia el footer del portfolio... 🍂',
    '☕ ¡Código 500! ¡Me voy planeando a repostar café y vuelvo! 🛬☕',
    '🏳️ ¡Mayday! Jorge, prepara una pista de aterrizaje en tu README... 🛸',
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startUfoCycle();
    }
  }

  ngOnDestroy(): void {
    if (this.flightTimer) clearTimeout(this.flightTimer);
    if (this.messageTimer) clearTimeout(this.messageTimer);
    if (this.crashTimer) clearTimeout(this.crashTimer);
    if (this.respawnTimer) clearTimeout(this.respawnTimer);
    if (this.glitchTimer) clearTimeout(this.glitchTimer);
  }

  private startUfoCycle(): void {
    const scheduleNextFlight = () => {
      const nextDelay = 22000 + Math.random() * 10000; // Entre 22s y 32s
      this.flightTimer = setTimeout(() => {
        if (!this.isAlarmed() && !this.isCrashing() && !this.isRespawning()) {
          const nextTraj = (this.trajectoryIndex() % 3) + 1;
          this.trajectoryIndex.set(nextTraj);

          setTimeout(() => {
            if (!this.isAlarmed() && !this.isCrashing() && !this.isRespawning()) {
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

  // Interacción al hacer click (disparo) sobre el OVNI
  onUfoClick(event: MouseEvent): void {
    event.stopPropagation();

    // Si ya está cayendo o reparándose, ignorar clicks extras
    if (this.isCrashing() || this.isRespawning()) return;

    const nextHits = this.hitCount() + 1;
    this.hitCount.set(nextHits);
    this.isBeamActive.set(false);
    this.isAlarmed.set(true);

    this.triggerHudGlitch();

    if (this.messageTimer) clearTimeout(this.messageTimer);

    if (nextHits < this.maxHits) {
      // Impacto 1 o 2
      const randomHitQuote = this.hitQuotes[Math.floor(Math.random() * this.hitQuotes.length)];
      this.message.set(randomHitQuote);

      this.messageTimer = setTimeout(() => {
        this.message.set(null);
        this.isAlarmed.set(false);
      }, 3500);
    } else {
      // ¡Impacto 3/3! Secuencia de caída suave y cómica (caída en espiral / planeo)
      this.triggerCrashSequence();
    }
  }

  private triggerHudGlitch(): void {
    this.hudGlitch.set(true);
    if (this.glitchTimer) clearTimeout(this.glitchTimer);
    this.glitchTimer = setTimeout(() => this.hudGlitch.set(false), 600);
  }

  private triggerCrashSequence(): void {
    this.isCrashing.set(true);
    const randomCrashQuote = this.crashQuotes[Math.floor(Math.random() * this.crashQuotes.length)];
    this.message.set(randomCrashQuote);

    // 1. Mensaje legible durante la primera parte de la caída (3.8s)
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => {
      this.message.set(null);
    }, 3800);

    // 2. Caída tranquila y descenso suave durante 4.6 segundos
    if (this.crashTimer) clearTimeout(this.crashTimer);
    this.crashTimer = setTimeout(() => {
      this.isAlarmed.set(false);
      this.isCrashing.set(false);
      this.isRespawning.set(true); // Oculto en el taller de reparación interestelar

      // 3. Reaparece tras 10 segundos con nave restaurada y 0/3 impactos
      if (this.respawnTimer) clearTimeout(this.respawnTimer);
      this.respawnTimer = setTimeout(() => {
        this.hitCount.set(0);
        this.isRespawning.set(false);
        this.trajectoryIndex.set((this.trajectoryIndex() % 3) + 1);
      }, 10000);
    }, 4600);
  }
}

import { Component, ChangeDetectionStrategy, signal, computed, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

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
  private themeService = inject(ThemeService);
  private isBrowser = isPlatformBrowser(this.platformId);
  private shotSound?: HTMLAudioElement;
  private flightTimer: any;
  private messageTimer: any;
  private crashTimer: any;
  private paratrooperEndTimer: any;
  private respawnTimer: any;
  private glitchTimer: any;
  private paratrooperTimer: any;

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

  // Feature desacoplada: Marciano en paracaídas al caer el OVNI 🪂👽
  showParatrooper = signal<boolean>(false);

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

  // Frases cómicas de Caída con Paracaídas 3/3
  private readonly crashQuotes = [
    '🚨 ¡Eyección de emergencia! ¡Abriendo paracaídas! 🪂👽',
    '⚡ ¡Houston, abandono la nave! ¡Nos vemos en el suelo! 🪂',
    '🛸 ¡El Garbage Collector se llevó el motor! ¡Flotando en calma! 🪂🍃',
    '☕ ¡Salvo el café espacial antes de que caiga el platillo! 🪂☕',
    '🏳️ ¡Flotando suavemente hacia tu pantalla terrícola! 🪂✨',
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.shotSound = new Audio('assets/sound/driken5482-retro-laser-1-236669.mp3');
      this.startUfoCycle();
    }
  }

  ngOnDestroy(): void {
    if (this.flightTimer) clearTimeout(this.flightTimer);
    if (this.messageTimer) clearTimeout(this.messageTimer);
    if (this.crashTimer) clearTimeout(this.crashTimer);
    if (this.paratrooperEndTimer) clearTimeout(this.paratrooperEndTimer);
    if (this.respawnTimer) clearTimeout(this.respawnTimer);
    if (this.glitchTimer) clearTimeout(this.glitchTimer);
    if (this.paratrooperTimer) clearTimeout(this.paratrooperTimer);
    this.shotSound?.pause();
    this.shotSound?.removeAttribute('src');
    this.shotSound?.load();
  }

  private startUfoCycle(): void {
    const scheduleNextFlight = () => {
      const nextDelay = 22000 + Math.random() * 10000;
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

  onUfoClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isCrashing() || this.isRespawning() || this.showParatrooper()) return;

    this.playShotSound();
    const nextHits = this.hitCount() + 1;
    this.hitCount.set(nextHits);
    this.isBeamActive.set(false);
    this.isAlarmed.set(true);

    this.triggerHudGlitch();

    if (this.messageTimer) clearTimeout(this.messageTimer);

    if (nextHits < this.maxHits) {
      const randomHitQuote = this.hitQuotes[Math.floor(Math.random() * this.hitQuotes.length)];
      this.message.set(randomHitQuote);

      this.messageTimer = setTimeout(() => {
        this.message.set(null);
        this.isAlarmed.set(false);
      }, 3500);
    } else {
      this.triggerCrashSequence();
    }
  }

  private playShotSound(): void {
    if (!this.isBrowser || !this.themeService.soundEnabled() || !this.shotSound) return;

    this.shotSound.currentTime = 0;
    this.shotSound.play().catch(() => undefined);
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

    // Salto en paracaídas a los 300ms tras el impacto
    if (this.paratrooperTimer) clearTimeout(this.paratrooperTimer);
    this.paratrooperTimer = setTimeout(() => {
      this.showParatrooper.set(true);
    }, 300);

    // Mensaje legible durante la primera fase de la eyección (3.5s)
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => {
      this.message.set(null);
    }, 3500);

    // 1. El OVNI termina su caída rápida a los 4.6s
    if (this.crashTimer) clearTimeout(this.crashTimer);
    this.crashTimer = setTimeout(() => {
      this.isAlarmed.set(false);
      this.isCrashing.set(false);
    }, 4600);

    // 2. El paracaidista flota ultra lento, lineal y disfrutable durante 11 segundos
    if (this.paratrooperEndTimer) clearTimeout(this.paratrooperEndTimer);
    this.paratrooperEndTimer = setTimeout(() => {
      this.showParatrooper.set(false);
      this.isRespawning.set(true); // En el taller de reparación interestelar

      // 3. Reaparición 4s después con nave restaurada y 0/3 impactos
      if (this.respawnTimer) clearTimeout(this.respawnTimer);
      this.respawnTimer = setTimeout(() => {
        this.hitCount.set(0);
        this.isRespawning.set(false);
        this.trajectoryIndex.set((this.trajectoryIndex() % 3) + 1);
      }, 4000);
    }, 11000);
  }
}

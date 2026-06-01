import { Component, inject, viewChild, ElementRef, effect, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';
import { AnalyticsDirective } from '../../shared/analytics.directive';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  standalone: true,
  imports: [CommonModule, AnalyticsDirective]
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  historyElement = viewChild<ElementRef>('history');
  isOpen = signal(false);
  showTooltip = signal(false);
  private openSound = new Audio('assets/u_xio2tir4to-bubble-pop-389501.mp3');

  constructor() {
    // Efecto para hacer scroll automático al final cuando llegan mensajes nuevos
    effect(() => {
      this.chatService.messages();
      this.isOpen(); // Escucha también cambios en la apertura para ajustar el scroll
      const el = this.historyElement()?.nativeElement;
      if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 100);
    });
  }

  ngOnInit() {
    // Mostrar el tooltip después de 2 segundos
    /*/setTimeout(() => {
      if (!this.isOpen()) {
        this.showTooltip.set(true);
      }
    }, 2000);*/

    // Enviar mensaje inicial silencioso para "despertar" al chatbot
    setTimeout(() => {
      this.chatService.sendMessage('hola, quien sos?', 3, true);
    }, 1000);
  }

  toggleChat() {
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.showTooltip.set(false);
      this.openSound.play().catch(err => console.warn('Error playing sound:', err));
    }
  }

  send(text: string) {
    if (text.trim()) {
      this.chatService.sendMessage(text);
    }
  }
}
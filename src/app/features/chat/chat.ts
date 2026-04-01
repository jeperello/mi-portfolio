import { Component, inject, viewChild, ElementRef, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  standalone: true,
  imports: [CommonModule]
})
export class ChatComponent {
  chatService = inject(ChatService);
  historyElement = viewChild<ElementRef>('history');
  isOpen = signal(true);

  constructor() {
    // Efecto para hacer scroll automático al final cuando llegan mensajes nuevos
    effect(() => {
      this.chatService.messages();
      this.isOpen(); // Escucha también cambios en la apertura para ajustar el scroll
      const el = this.historyElement()?.nativeElement;
      if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 100);
    });
  }

  toggleChat() {
    this.isOpen.update(open => !open);
  }

  send(text: string) {
    if (text.trim()) {
      this.chatService.sendMessage(text);
    }
  }
}
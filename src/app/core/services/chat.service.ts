import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// Interfaces para tipar la comunicación con el backend
interface ChatBackendRequest {
  userPrompt: string;
  conversationHistory: { role: 'user' | 'assistant', content: string }[];
}

interface ChatBackendResponse {
  assistantReply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private backendChatUrl = 'https://proxi-ia.onrender.com/api/chat';

  // Use Signals for a reactive and efficient state
  messages = signal<{ role: 'system' | 'user' | 'assistant', content: string }[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient) {
    this.messages.set([
      {
        role: 'assistant',
        content: '¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte a conocer los proyectos de Jorge Perello. ¿Qué te gustaría saber?'
      }
    ]);
  }

  async sendMessage(prompt: string) {
    if (this.isLoading() || !prompt.trim()) return;

    // 1. Añadimos el mensaje del usuario a la UI
    const userMsg = { role: 'user' as const, content: prompt };
    this.messages.update(prev => [...prev, userMsg]);
    this.isLoading.set(true);

    try {
      // 2. Preparamos el historial (solo user y assistant)
      // Excluimos el ÚLTIMO mensaje (el prompt actual) porque va en 'userPrompt'
      const history = this.messages()
        .filter(m => m.content !== prompt)
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      const requestBody: ChatBackendRequest = {
        userPrompt: prompt,
        conversationHistory: history
      };

      // 3. Petición al Proxy
      const response = await lastValueFrom(
        this.http.post<ChatBackendResponse>(this.backendChatUrl, requestBody)
      );

      // 4. Añadimos la respuesta del bot
      const botReply = response?.assistantReply || 'Lo siento, no pude obtener respuesta.';
      this.messages.update(prev => [...prev, { role: 'assistant', content: botReply }]);

    } catch (error) {
      console.error('Error:', error);
      this.messages.update(prev => [...prev, { role: 'assistant', content: 'Hubo un error de conexión.' }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
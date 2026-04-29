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
    this.messages.set([]);
  }

  async sendMessage(prompt: string, retries = 3, isSilent = false): Promise<void> {
    if (this.isLoading() || !prompt.trim()) return;

    // Solo añadimos el mensaje del usuario si NO es silencioso y es el primer intento
    if (!isSilent) {
      const currentMessages = this.messages();
      const isRetry = currentMessages.length > 0 && currentMessages[currentMessages.length - 1].content === prompt;
      
      if (!isRetry) {
        const userMsg = { role: 'user' as const, content: prompt };
        this.messages.update(prev => [...prev, userMsg]);
      }
    }
    
    this.isLoading.set(true);

    try {
      const history = this.messages()
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

      const requestBody: ChatBackendRequest = {
        userPrompt: prompt,
        conversationHistory: history
      };

      const response = await lastValueFrom(
        this.http.post<ChatBackendResponse>(this.backendChatUrl, requestBody)
      );

      const botReply = response?.assistantReply || 'Lo siento, no pude obtener respuesta.';
      this.messages.update(prev => [...prev, { role: 'assistant', content: botReply }]);
      this.isLoading.set(false);

    } catch (error) {
      console.error(`Error (intentos restantes: ${retries}):`, error);
      
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.isLoading.set(false);
        return this.sendMessage(prompt, retries - 1, isSilent);
      } else {
        // Si falla después de reintentos, solo mostramos el error si no era un mensaje silencioso
        // o si queremos que el usuario sepa que algo va mal.
        this.messages.update(prev => [...prev, { role: 'assistant', content: 'El servidor está tardando en despertar. Por favor, intenta de nuevo en unos segundos.' }]);
        this.isLoading.set(false);
      }
    }
  }
}
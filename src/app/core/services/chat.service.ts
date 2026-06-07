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
  
  // Flag de control: ¡Cámbio a true para no gastar tokens en desarrollo!
  public localMode = false;

  // Use Signals for a reactive and efficient state
  messages = signal<{ role: 'system' | 'user' | 'assistant', content: string }[]>([]);
  isLoading = signal(false);

  private mockReplies = [
    "¡Hola! Soy tu asistente en modo local. Kafka está zumbando, pero yo estoy descansando.",
    "Interesante pregunta. En un mundo ideal te respondería con IA, pero hoy soy solo un script.",
    "¡Entendido! Estoy procesando tu mensaje en mi cluster mental imaginario.",
    "Backend desconectado, pero mi ingenio sigue intacto. ¿En qué más puedo no-ayudarte?",
    "¡Bip bup! Modo local activado. El servidor real está durmiendo la siesta."
  ];

  constructor(private http: HttpClient) {
    this.messages.set([]);
  }

  async sendMessage(prompt: string, retries = 3, isSilent = false): Promise<void> {
    if (this.isLoading() || !prompt.trim()) return;

    if (!isSilent) {
      const currentMessages = this.messages();
      const isRetry = currentMessages.length > 0 && currentMessages[currentMessages.length - 1].content === prompt;
      
      if (!isRetry) {
        this.messages.update(prev => [...prev, { role: 'user', content: prompt }]);
      }
    }
    
    this.isLoading.set(true);

    // MODO LOCAL: Simulamos respuesta sin pegada real
    if (this.localMode) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulamos pensamiento
      const randomReply = this.mockReplies[Math.floor(Math.random() * this.mockReplies.length)];
      this.messages.update(prev => [...prev, { role: 'assistant', content: randomReply }]);
      this.isLoading.set(false);
      return;
    }

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
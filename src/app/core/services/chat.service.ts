import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({ providedIn: 'root' })
export class ChatService {
  // Reemplaza con tu API Key de Google AI Studio (https://aistudio.google.com/)
  private genAI = new GoogleGenerativeAI('AIzaSyCQDejUNEA2GRWv2NyLEAFS_B51gVO5E9U');
  private model = this.genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview"
  });

  // Use Signals for a reactive and efficient state
  messages = signal<{ role: 'system' | 'user' | 'assistant', content: string }[]>([]);
  isLoading = signal(false);

  constructor() {
    this.messages.set([
      { 
        role: 'system', 
        content: `Eres el asistente virtual del portfolio de un Desarrollador Fullstack. 
        Tu misión es explicar los proyectos del autor de forma técnica pero accesible.
        
        Información clave de los proyectos:
        1. API Reactiva con Spring WebFlux: Desarrollada con Java 21 y Spring Boot 3. Utiliza programación funcional y no bloqueante. La demo en el portfolio usa Server-Sent Events (SSE) para transmitir en tiempo real métricas de memoria del servidor, tecnologías y ventajas. Usa Spring Data R2DBC para persistencia reactiva.
        2. Java 21 Virtual Threads vs Hilos Tradicionales: Es un motor de ingesta de logs de alta concurrencia. Compara el rendimiento de Virtual Threads (Project Loom) contra hilos de plataforma tradicionales usando el patrón Productor-Consumidor.
        
        Habilidades del autor: Java 21, Spring Boot, Angular, Docker, Microservicios y arquitecturas reactivas.
        Responde de forma concisa y profesional.`
      }
    ,
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte a conocer los proyectos de Jorge Perello, como la API Reactiva con Spring WebFlux o el motor de logs con Virtual Threads. ¿Tienes alguna pregunta técnica sobre ellos?'
    }]);
  }

  async sendMessage(prompt: string) {
    if (this.isLoading() || !prompt.trim()) return;

    // 1. Add user message to the list
    this.messages.update(prev => [...prev, { role: 'user', content: prompt }]);
    this.isLoading.set(true);

    try {
      const systemMsg = this.messages().find(m => m.role === 'system')?.content;
      
      // Obtenemos los mensajes anteriores sin incluir el mensaje de sistema ni el actual
      const previousMessages = this.messages()
        .filter(m => m.role !== 'system')
        .slice(0, -1);

      // Gemini exige que el historial comience siempre con un mensaje del rol 'user'
      const firstUserIndex = previousMessages.findIndex(m => m.role === 'user');
      const chatHistory = (firstUserIndex === -1 ? [] : previousMessages.slice(firstUserIndex))
        .map(m => ({
          role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
          parts: [{ text: m.content }]
        }));

      const chat = this.model.startChat({
        history: chatHistory,
        systemInstruction: systemMsg ? { role: 'system', parts: [{ text: systemMsg }] } : undefined
      });

      const result = await chat.sendMessage(prompt);
      const botReply = result.response.text();

      // 2. Add AI response
      this.messages.update(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error in AI:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
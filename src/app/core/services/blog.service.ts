import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, switchMap } from 'rxjs';
import { Blog, BlogComment } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl = 'https://comment-service-4192.onrender.com/api/v1';

  /**
   * Colección central de metadatos del blog.
   * El contenido HTML de cada post se aloja de forma modular en /assets/posts/
   * facilitando el mantenimiento y crecimiento limpio de la bitácora.
   */
  private backupBlogs: Blog[] = [
    {
      id: '3',
      title: 'Construyendo Fleet-FiftyFifty',
      subtitle: '<Del problema real a una aplicación completa con Java, Spring Boot, DDD, Arquitectura Hexagonal y TDD.</br>',
      status: 'En progreso',
      excerpt:
        'Del problema real a una aplicación completa con Java, Spring Boot, DDD, Arquitectura Hexagonal y TDD.',
      contentUrl: 'assets/posts/post-3-fleet-intro.html',
      content: '',
      date: '05 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Java', 'Spring Boot', 'DDD', 'Hexagonal Architecture', 'TDD', 'En progreso'],
      chapters: [
        { title: 'Capítulo 1 — Del problema a la idea', status: 'Done', postId: '4' },
        { title: 'Capítulo 2 — La importancia del análisis', status: 'Done', postId: '5' },
        { title: 'Capítulo 3 — Entendiendo el dominio (DDD)', status: 'Done', postId: '6' },
        { title: 'Capítulo 4 — ¿Por qué elegí Arquitectura Hexagonal?', status: 'Ultimo', postId: '7' },
        { title: 'Capítulo 5 — Mi primera experiencia aplicando TDD', status: 'En proceso' },
        { title: 'Capítulo 6 — Despliegue del backend', status: 'Próximo' },
        { title: 'Capítulo 7 — Implementando la aplicación desde Angular', status: 'Próximo' },
      ],
    },
    {
      id: '1',
      title: 'Chatbot: El Detrás de Escena (¿Adiós a Chatie en Node.js?)',
      excerpt:
        '¿Es Java demasiada artillería para un chatbot? Acompañame en este experimento migrando de un proxy en Node.js a la robustez de Spring AI.',
      contentUrl: 'assets/posts/post-1-chatbot.html',
      content: '',
      date: '05 de mayo de 2026',
      author: 'Jorge Perello',
      tags: ['IA', 'Spring AI', 'Java 21', 'Experimento', 'Software Architecture'],
    },
    {
      id: '2',
      title: 'Spring MVC vs WebFlux vs Virtual Threads',
      excerpt:
        'Una comparativa profunda entre los diferentes paradigmas de concurrencia en Spring: desde el modelo thread-per-request tradicional hasta la reactividad de WebFlux y la revolución de los Virtual Threads.',
      contentUrl: 'assets/posts/post-2-spring-mvc.html',
      content: '',
      date: '15 de abril de 2026',
      author: 'Jorge Perello',
      tags: ['Spring Boot', 'WebFlux', 'Virtual Threads', 'Java 21'],
    },
    {
      id: '4',
      title: '🚀 Construyendo Fleet-FiftyFifty desde cero',
      subtitle: 'Capítulo 1 — Del problema a la idea',
      status: 'Completado',
      showCard: false,
      excerpt:
        'Todo gran proyecto nace de una necesidad insatisfecha. En logística de flota, repartir la carga al 50/50 requiere algoritmos robustos y una visión clara.',
      contentUrl: 'assets/posts/post-4-fleet-cap-1.html',
      content: '',
      date: '01 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 1', 'Java', 'Arquitectura'],
    },
    {
      id: '5',
      title: 'Capítulo 2 — La importancia del análisis',
      subtitle: 'Caso de Estudio Fleet-FiftyFifty',
      status: 'En progreso',
      showCard: false,
      excerpt:
        'Antes de tirar código Java, analizamos las reglas de negocio y los límites de nuestro dominio para evitar refactorizaciones catastróficas.',
      contentUrl: 'assets/posts/post-5-fleet-cap-2.html',
      content: '',
      date: '05 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 2', 'DDD', 'Spring Boot'],
    },
    {
      id: '6',
      title: 'Capítulo 3 — Entendiendo el dominio (DDD)',
      subtitle: 'Enfoque DDD.',
      status: 'Completado',
      showCard: false,
      excerpt:
        'Etapa de Análisis: Enfoque DDD.',
      contentUrl: 'assets/posts/post-6-fleet-cap-3.html',
      content: '',
      date: '05 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 3', 'DDD', 'Analisis', 'Lenguaje Ubicuo'],
    },
    {
      id: '7',
      title: 'Capítulo 4 — ¿Por qué elegí Arquitectura Hexagonal?',
      subtitle: 'Implementando la arquitectura Hexagonal.',
      status: 'Ultimo',
      showCard: false,
      excerpt:
        'Etapa de desarrollo.',
      contentUrl: 'assets/posts/post-7-fleet-cap-4.html',
      content: '',
      date: '13 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 4', 'Hexa', 'Desa', 'Arquitectura Hexagonal'],
    },
    {
      id: '8',
      title: 'Capítulo 5 — Mi primera experiencia aplicando TDD',
      subtitle: 'Desarrollo guiado por pruebas en el dominio.',
      status: 'En proceso',
      showCard: false,
      excerpt: 'Desarrollo guiado por pruebas (TDD) aplicado al núcleo de negocio.',
      contentUrl: 'assets/posts/post-8-fleet-cap-5.html',
      content: '',
      date: 'Próximamente',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 5', 'TDD', 'Testing', 'Java'],
    },
    {
      id: '9',
      title: 'Capítulo 6 — Despliegue del backend',
      subtitle: 'Infraestructura y puesta en marcha.',
      status: 'Próximo',
      showCard: false,
      excerpt: 'Estrategias de despliegue y puesta en marcha de la API backend.',
      contentUrl: 'assets/posts/post-9-fleet-cap-6.html',
      content: '',
      date: 'Próximamente',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 6', 'Deploy', 'Cloud', 'Docker'],
    },
    {
      id: '10',
      title: 'Capítulo 7 — Implementando la aplicación desde Angular',
      subtitle: 'Conexión del frontend reactivo.',
      status: 'Próximo',
      showCard: false,
      excerpt: 'Construcción del cliente web en Angular 21 y consumo de los endpoints.',
      contentUrl: 'assets/posts/post-10-fleet-cap-7.html',
      content: '',
      date: 'Próximamente',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 7', 'Angular', 'Frontend', 'Signals'],
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de posts (metadatos).
   */
  getBlogs(): Observable<Blog[]> {
    return of(this.backupBlogs);
  }

  /**
   * Busca un post por ID y carga dinámicamente su contenido HTML si no ha sido cargado.
   */
  getBlogById(id: string): Observable<Blog | undefined> {
    const blog = this.backupBlogs.find((b) => b.id === id);
    if (!blog) {
      return of(undefined);
    }

    if (blog.contentUrl && !blog.content) {
      return this.http.get(blog.contentUrl, { responseType: 'text' }).pipe(
        map((htmlContent) => {
          blog.content = htmlContent;
          return blog;
        }),
        catchError((err) => {
          console.error(`Error cargando el archivo de contenido de ${blog.contentUrl}:`, err);
          return of(blog);
        })
      );
    }

    return of(blog);
  }

  /**
   * Obtiene comentarios específicos de un post.
   */
  getComments(postId: string): Observable<BlogComment[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts/${postId}/comments`).pipe(
      map((comments) =>
        comments.map((c) => ({
          id: c.id?.toString(),
          author: c.username || 'Explorador Anónimo',
          content: c.content,
          date: this.formatDate(c.createdAt),
        })),
      ),
      catchError(() => of([])),
    );
  }

  /**
   * Agrega un comentario a un post específico.
   */
  addComment(postId: string, comment: { username: string; content: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, comment);
  }

  /**
   * Envía un mensaje de contacto (usa el postId 3 por defecto).
   */
  sendContactMessage(email: string, message: string): Observable<any> {
    const payload = {
      username: email,
      content: message,
    };
    return this.http.post(`${this.baseUrl}/posts/3/comments`, payload);
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return 'Fecha estelar desconocida';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

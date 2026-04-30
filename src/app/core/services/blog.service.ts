import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Blog, BlogComment } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'https://comment-service-4192.onrender.com/api/v1';

  // El "Plan B": Estos datos aparecerán si la API está vacía o se toma un descanso.
  private backupBlogs: Blog[] = [
   {
      id: '1',
      title: 'Chatbot: El Detrás de Escena (¿Adiós a Chatie en Node.js?)',
      excerpt: '¿Es Java demasiada artillería para un chatbot? Acompañame en este experimento migrando de un proxy en Node.js a la robustez de Spring AI.',
      content: `
        <p>Si estás acá, es porque viste el post en LinkedIn y querés saber si realmente me volví loco. <b>¿Reemplazar un proxy de Node.js que ya funciona por Spring AI?</b> Parece un tiro en el pie, ¿no?</p>
        
        <div class="section">
          <h3>El Punto de Partida: "Chatie", el humilde</h3>
          <p>Actualmente, el chatbot que ves en este portfolio (al que cariñosamente llamo "Chatie") corre sobre un proxy muy simple en Node.js. Cumple su función: recibe mensajes, le pregunta a Gemini y te devuelve la respuesta. <i>(Atado con alambre, pero funcional).</i></p>
        </div>

        <div class="highlight">
          <h3>La Gran Pregunta: ¿Java es "Demasiada Artillería"?</h3>
          <p>Muchos colegas me dicen: <i>"Jorge, Java es para sistemas bancarios, no para un chat de portfolio"</i>. Y tienen parte de razón. Pero mi objetivo no es solo que funcione, es llevar la arquitectura al siguiente nivel.</p>
        </div>

        <div class="section">
          <h3>Fase 1: El Diagnóstico</h3>
          <p>Hoy estamos en la fase de "corazón abierto". Estoy analizando cómo Chatie maneja el historial de conversación en Node para replicarlo (y mejorarlo) con las <code>ChatMemory</code> de Spring AI.</p>
          <p><b>Próxima parada:</b> Los primeros benchmarks. ¿Node.js vs Spring Boot? Se vienen los números.</p>
        </div>

        <h3>El Experimento: Los 3 pilares que voy a evaluar</h3>
        <ul>
          <li><b>1. Curva de Aprendizaje:</b> ¿Qué tan difícil es saltar de un <code>fetch</code> en Node a las abstracciones de <code>Spring AI</code>?</li>
          <li><b>2. Rendimiento Real:</b> ¿Los Virtual Threads de Java 21 realmente marcan la diferencia en un entorno de baja latencia?</li>
          <li><b>3. Productividad:</b> ¿Las abstracciones de Spring me ahorran tiempo o me obligan a escribir "boilerplate" infinito?</li>
        </ul>

        <p class="mt-4"><i>Este post es parte de una serie. Si tenés algún consejo o creés que estoy cometiendo un error épico, ¡dejame un comentario abajo! 👇</i></p>
      `,
      date: '27 de abril de 2026',
      author: 'Jorge Perello',
      tags: ['IA', 'Spring AI', 'Node.js', 'Experimento', 'Java 21']
    },
 {
      id: '2',
      title: 'Spring MVC vs WebFlux vs Virtual Threads',
      excerpt: 'Una comparativa profunda entre los diferentes paradigmas de concurrencia en Spring: desde el modelo thread-per-request tradicional hasta la reactividad de WebFlux y la revolución de los Virtual Threads.',
      content: `
        <p>En el ecosistema Java, la evolución de cómo manejamos la concurrencia ha dado pasos agigantados en los últimos años. Especialmente con la llegada de Java 21 y los Virtual Threads.</p>
        <b>¿Qué elegir en 2026 para construir APIs escalables?</b>

        <div class="section">
          <p>En los últimos meses estuve analizando distintas formas de construir APIs en Spring Boot con un objetivo claro: encontrar el mejor equilibrio entre rendimiento y simplicidad.</p>
          <p>Hoy tenemos tres enfoques principales:
    <b>Spring Web MVC (tradicional), Spring WebFlux (reactivo), Spring MVC + Virtual Threads (Java 21)</b>
         <br>(Nota: Este análisis está inspirado en pruebas reales, visita la seccion <a href="/">Mis proyectos</a> para ver ejemplos reales, incluyendo la charla de Gabriel Jiménez en Commit Conf: <a href="https://www.youtube.com/watch?v=t_FHfbfaanY" target="_blank">Ver charla en YouTube</a>)</p>
        </div>
        <h3>1. Spring MVC, es el tradicional que usamos siempre</h3>
        <p>El modelo tradicional. Cada petición entrante consume un hilo de plataforma del pool (normalmente Tomcat). Si la petición hace I/O bloqueante (como una consulta a BD o una API externa), el hilo se queda parado esperando, desperdiciando recursos valiosos.</p> 
        El problema:
        <div class="highlight">1 request = 1 thread bloqueado esperando I/O</div>
        <div class="highlight">
          <p>Ventajas</p>
          <ul>
            <li>Simple de entender y mantener.</li>
            <li>Ecosistema maduro. Gran cantidad de librerías y herramientas compatibles.</li>
            <li>Ideal para equipos grandes o proyectos existentes.</li>
          </ul>
        </div>
        <div class="highlight">
          <p>Desventajas</p>
          <ul>
            <li>Bloqueante.</li>
            <li>Escala peor bajo alta concurrencia.</li>
            <li>Uso intensivo de threads del sistema.</li>
          </ul>
        </div>
        <h3>2. Spring WebFlux (Programación Reactiva)</h3>
        <p>Introducido para solucionar los problemas de escalabilidad del modelo bloqueante. Utiliza el paradigma de Event Loop y non-blocking I/O (modelo no bloqueante basado en eventos). Permite manejar miles de conexiones con muy pocos hilos. El <b>"coste"</b> es una curva de aprendizaje más alta y un código más complejo debido al uso de operadores como flatMap, zip, tipo de datos Flux o Mono, es un nuevo mundo para trabajar.</p>
        <div class="highlight">
          <p>Ventajas</p>
          <ul>
            <li>Basado en eventos.No bloqueante.</li>
            <li>Escala mejor bajo alta concurrencia.</li>
            <li>Menor uso de threads del sistema.</li>
            <li>Ideal para aplicaciones con alta latencia o I/O intensivo.</li>
            <li>Excelente para alta concurrencia.</li>
          </ul>
        </div>
        <div class="highlight">
          <p>Desventajas</p>
          <ul>
            <li>Mayor complejidad. Código más difícil de leer/debuggear.</li>
            <li>Curva de aprendizaje alta.</li>
            <li>Necesitás librerías reactivas (R2DBC, WebClient, etc.).</li>
            <li>Mezclar código bloqueante rompe todo el modelo.</li>
          </ul>
        </div>
        <h3>3. Spring MVC + Virtual Threads (Java 21)</h3>
        <p>La "bala de plata" para muchos. Con Java 21, podemos usar el modelo de programación sencillo de Spring MVC (imperativo) pero sobre Virtual Threads. Cuando un hilo virtual encuentra una operación bloqueante, la JVM lo "desmonta" del hilo de plataforma real, permitiendo que otros hilos virtuales sigan ejecutándose. Obtenemos escalabilidad similar a WebFlux con la simplicidad de Spring MVC.</p>
        <div class="highlight">
          <p>Ventajas</p>
          <ul>
            <li>Código simple (igual que MVC).</li>
            <li>Gran mejora en escalabilidad.</li>
            <li>Menor uso de threads del sistema.</li>
            <li>No necesitás reescribir todo a reactivo.</li>
            <li>Compatible con librerías existentes (JPA, etc.).</li>
          </ul>
        </div>
        <div class="highlight">
          <p>Desventajas</p>
          <ul>
            <li>Todavía relativamente nuevo.</li>
            <li>Cuidado con ThreadLocal y synchronized.</li>
            <li>Algunas librerías pueden no estar optimizadas.</li>
          </ul>
        </div>
                <h3>Comparativa Real: throughput y manejo de peticiones</h3>
        <p>En la siguiente imagen podemos observar cómo se comportan estas tecnologías bajo carga.<br> 1° 50 Request por segundo. 2° 100 Request por segundo, ambos durante 10 segundos.</p>
        <img src="assets/blog/comparativa requests.png" class="blog-image">

        <p>Resultados generales:</p>
          <ul>
            <li>WebFlux</li>
            <ul>
              <li>Mejor rendimiento en escenarios extremos</li>
              <li>Menor latencia máxima.</li>
            </ul>
          </ul>
          <ul>
            <li>Virtual Threads</li>
            <ul>
              <li>Muy cerca de WebFlux</li>
              <li>Mucho mejor que MVC clásico.</li>
              <li>Sin complejidad adicional.</li>
            </ul>
          </ul>
          <ul>
            <li>MVC tradicional</li>
            <ul>
              <li>El peor en alta concurrencia</li>
              <li>Se queda sin threads.</li>
            </ul>
          </ul>
          <h3>Conclusión clave:</h3>
  <p>WebFlux gana técnicamente, pero Virtual Threads tienen el mejor balance.</p>
          <img src="assets/blog/comparativa.png" class="blog-image">

        <h3>Conclusión, ¿Cuál elegir? </h3>
        <p>WebFlux sigue siendo la mejor opción en escenarios extremos, pero introduce complejidad significativa.</p> <div class="highlight">Virtual Threads ofrecen el mejor balance entre rendimiento y simplicidad.</div>
        <p>Para nuevos microservicios, mi elección hoy es clara: Spring MVC + Virtual Threads, es la opción recomendada para la mayoría de aplicaciones empresariales que buscan escalabilidad sin sacrificar mantenibilidad.</p>
        
      `,
      date: '15 de abril de 2026',
      author: 'Jorge Perello',
      tags: ['Spring Boot', 'WebFlux', 'Virtual Threads', 'Java 21']
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Trae todos los posts. Si la API no tiene nada, tira de los datos de backup.
   */
  getBlogs(): Observable<Blog[]> {
    return of(this.backupBlogs);
   /* return this.http.get<any[]>(`${this.baseUrl}/posts`).pipe(
      map(posts => {
        if (!posts || posts.length === 0) {
          console.warn('⚠️ La API no devolvió posts. Usando el escuadrón de backup...');
          return this.backupBlogs;
        }
        return posts.map(p => this.mapToBlog(p));
      }),
      catchError(err => {
        console.error('🔥 Error al conectar con la API de posts:', err);
        return of(this.backupBlogs);
      })
    );*/
  }

  /**
   * Busca un post por ID. Intenta en la API y si no, en el backup.
   */
  getBlogById(id: string): Observable<Blog | undefined> {
    /*return this.http.get<any>(`${this.baseUrl}/posts/${id}`).pipe(
      map(p => this.mapToBlog(p)),
      catchError(() => of(this.backupBlogs.find(b => b.id === id)))
    );*/
    return of(this.backupBlogs.find(b => b.id === id));
  }

  /**
   * Obtiene comentarios específicos de un post.
   */
  getComments(postId: string): Observable<BlogComment[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts/${postId}/comments`).pipe(
      map(comments => comments.map(c => ({
        id: c.id?.toString(),
        author: c.username || 'Explorador Anónimo',
        content: c.content,
        date: this.formatDate(c.createdAt)
      }))),
      catchError(() => of([]))
    );
  }

  /**
   * Agrega un comentario a un post específico.
   */
  addComment(postId: string, comment: { username: string, content: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, comment);
  }

  /**
   * Envía un mensaje de contacto (usa el postId 3 por defecto).
   */
  sendContactMessage(email: string, message: string): Observable<any> {
    const payload = {
      username: email,
      content: message
    };
    return this.http.post(`${this.baseUrl}/posts/3/comments`, payload);
  }

  // --- Helpers de Mapeo ---

  private mapToBlog(apiPost: any): Blog {
    return {
      id: apiPost.id.toString(),
      title: apiPost.title,
      excerpt: apiPost.excerpt || apiPost.summary,
      content: apiPost.content,
      date: this.formatDate(apiPost.createdAt),
      author: apiPost.author,
      tags: apiPost.tags || []
    };
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return 'Fecha estelar desconocida';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

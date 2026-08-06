import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Blog, BlogComment } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl = 'https://comment-service-4192.onrender.com/api/v1';

  // El "Plan B": Estos datos aparecerán si la API está vacía o se toma un descanso.
  private backupBlogs: Blog[] = [
    {
      id: '3',
      title: 'Construyendo Fleet-FiftyFifty',
      subtitle: 'Del problema real a una aplicación completa con Java, Spring Boot, DDD, Arquitectura Hexagonal y TDD.',
      status: 'En progreso',
      excerpt:
        'Del problema real a una aplicación completa con Java, Spring Boot, DDD, Arquitectura Hexagonal y TDD.',
      chapters: [
        { title: 'Capítulo 1 — Del problema a la idea', status: 'Done', postId: '4' },
        { title: 'Capítulo 2 — La importancia del análisis', status: 'Actual', postId: '5' },
        { title: 'Capítulo 3 — Entendiendo el dominio (DDD)', status: 'Próximo' },
        { title: 'Capítulo 4 — ¿Por qué elegí Arquitectura Hexagonal?', status: 'Próximo' },
        { title: 'Capítulo 5 — Modelando los primeros casos de uso', status: 'Próximo' },
        { title: 'Capítulo 6 — Mi primera experiencia aplicando TDD', status: 'Próximo' },
        { title: 'Capítulo 7 — Implementando la aplicación', status: 'Próximo' },
      ],
      content: `
        <div class="subtitle-container">
          <p class="blog-subtitle">Del problema real a una aplicación completa con Java, Spring Boot, DDD, Arquitectura Hexagonal y TDD.</p>
        </div>

        <div class="section">
          <h3>🚀 Bienvenido a la bitácora de desarrollo</h3>
          <p>En esta serie documentaremos paso a paso el diseño y construcción de <b>Fleet-FiftyFifty</b>. No es solo un proyecto teórico, es una aplicación completa nacida de un problema real de ingeniería de software.</p>
        </div>

        <div class="highlight">
          <h3>📌 Estado actual de la serie</h3>
          <p>Nos encontramos trabajando en el <b>Capítulo 2 — La importancia del análisis</b>. A continuación podés navegar por cada uno de los capítulos publicados en el índice.</p>
        </div>
      `,
      date: '05 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Java', 'Spring Boot', 'DDD', 'Hexagonal Architecture', 'TDD', 'En progreso'],
    },
    {
      id: '1',
      title: 'Chatbot: El Detrás de Escena (¿Adiós a Chatie en Node.js?)',
      excerpt:
        '¿Es Java demasiada artillería para un chatbot? Acompañame en este experimento migrando de un proxy en Node.js a la robustez de Spring AI.',
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
        <img src="assets/blog/Chatie siendo remplazado.jpeg" class="blog-image">

        <h3>El Experimento: Los 3 pilares que voy a evaluar</h3>
        <ul>
          <li><b>1. Curva de Aprendizaje:</b> ¿Qué tan difícil es saltar de un <code>fetch</code> en Node a las abstracciones de <code>Spring AI</code>?</li>
          <li><b>2. Rendimiento Real:</b> ¿Los Virtual Threads de Java 21 realmente marcan la diferencia en un entorno de baja latencia?</li>
          <li><b>3. Productividad:</b> ¿Las abstracciones de Spring me ahorran tiempo o me obligan a escribir "boilerplate" infinito?</li>
        </ul>

        <hr class="my-5">

        <div class="section">
          <h3>🚀 Los hitos de este primer sprint</h3>
          <ul>
            <li><b>Java 21 & Virtual Threads:</b> Preparación para una concurrencia masiva con un consumo mínimo de recursos.</li>
            <li><b>Spring AI (Google GenAI):</b> Se pasó de usar SDKs específicos a una capa de abstracción que permite cambiar de LLM (Gemini, OpenAI, Llama) cambiando solo una línea de configuración.</li>
            <li><b>Arquitectura Profesional:</b> Implementación de DTOs con <b>Java Records</b>, servicios inyectados y desacoplamiento de lógica.</li>
            <li><b>CI/CD desde el minuto 0:</b> Ya se tiene configurado un pipeline con <b>GitHub Actions</b> para asegurar que cada commit sea testeado automáticamente.</li>
          </ul>
        </div>
        <div class="highlight">
          <h3>💡 Aunque no todo es color de rosas</h3>
          <p>Estuve peleando un poco con el error 429. Este error normalmente indica que se están realizando demasiadas peticiones. Pero luego de chequear la API KEy y el modelo, y las peticiones con google, estaba todo ok.
           Sin embargo, en este caso, el error especificaba que el límite para el modelo gemini-2.0-flash era cero.
           El detalle: Al usar librerías nuevas como Spring AI Google GenAI, el autoconfigurador a veces intenta usar la versión más reciente del modelo por defecto (la 2.0).
           Y yo queria usar la versión 1.5, que es la que tengo habilitada. La solución fue explícitamente configurar el modelo a usar en el application.properties:
           <code>spring.ai.google.model=gemini-1.5-pro</code>
           Esto forzó a Spring AI a usar el modelo correcto y se solucionó el error 429.
           <i>(Moraleja: Siempre revisen qué modelo está intentando usar la librería, a veces no es el que creen).</i>
          </p>
        </div>
       <div class="highlight">
          <h3>💡 El mayor aprendizaje hasta ahora</h3>
          <p>La "magia" de las abstracciones de Spring AI tiene su precio: <b>la precisión</b>. Pelearse con los modelos en fase <i>v1beta</i> y los límites de cuota recordó que, al entender qué pasa bajo el capó (el SDK crudo de Google) es lo que realmente resuelve los problemas.</p>
        </div>

        <p class="mt-4"><i>Este post es parte de una serie. Si tenés algún consejo o creés que estoy cometiendo un error épico, ¡dejame un comentario abajo! 👇</i></p>
      `,
      date: '05 de mayo de 2026',
      author: 'Jorge Perello',
      tags: ['IA', 'Spring AI', 'Java 21', 'Experimento', 'Software Architecture'],
    },
    {
      id: '2',
      title: 'Spring MVC vs WebFlux vs Virtual Threads',
      excerpt:
        'Una comparativa profunda entre los diferentes paradigmas de concurrencia en Spring: desde el modelo thread-per-request tradicional hasta la reactividad de WebFlux y la revolución de los Virtual Threads.',
      content: `
              <b>¿Qué elegir en 2026 para construir APIs escalables?</b>
        <p>En el ecosistema Java, la evolución de cómo manejamos la concurrencia ha dado pasos agigantados en los últimos años. Especialmente con la llegada de Java 21 y los Virtual Threads.</p>

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
      content: `
        <div class="section">
          <h3>🚀 Bienvenido a la bitácora de este desarrollo</h3>
          <div class="highlight">
            <p class="lead"><b>Los mejores proyectos no nacen porque queremos probar una tecnología nueva. Nacen porque alguien tiene un problema real, que vale la pena resolver.</b></p>
          </div>
    <h2 style="margin: 0px;important">¿Cómo nació la idea?</h2>
    <p>Un amigo me comentó cómo organizaba las cuentas de una sociedad de Uber/Didi.<br/>
    El acuerdo era muy simple:</p>
    <ul class="agreement-list">
      <li>🚕 Uno de los socios aporta el vehículo.</li>
      <li>👨‍✈️ El otro aporta su tiempo y trabajo como conductor.</li>
    </ul>
    <p>Al finalizar cada semana debían sumar ingresos, descontar gastos y calcular cuánto dinero le correspondía a cada uno. Después de hacer las cuentas, determinaban quién debía transferir dinero al otro para que ambos terminaran exactamente con el reparto acordado.</p>

    <p>La primera solución que le propuse fue bastante sencilla: una hoja de cálculo compartida.</p>
    <p>La idea funcionó. Automatizaba gran parte de los cálculos y evitaba hacer cuentas manualmente todas las semanas.</p>

    <p>Pero hubo una pregunta que no dejó de dar vueltas en mi cabeza:</p>
    <blockquote><b>¿Y si, en lugar de mejorar una planilla, construyo una aplicación diseñada específicamente para resolver este problema?</b></blockquote>

    <p>Así nació <strong>Fleet-FiftyFifty</strong>.</p>
    <p>No porque haga falta otra aplicación más, sino porque creo que los mejores proyectos personales son aquellos que intentan resolver un problema real.</p>

    <figure class="image-placeholder">
      <figcaption>📷 <strong>Imagen 1:</strong> </figcaption>
    </figure>

    <h2>Mucho más que un proyecto personal</h2>
    <p>Este proyecto también representa un desafío personal. Quiero aprovecharlo para incorporar prácticas que hace tiempo estudio y que ahora quiero aplicar de forma completa en un proyecto real.</p>
    
    <p>Entre ellas:</p>
    <ul>
      <li>Arquitectura Hexagonal.</li>
      <li>Principios SOLID.</li>
      <li>Desarrollo guiado por pruebas (TDD).</li>
    </ul>

    <p>No quiero aprender estos conceptos leyendo documentación o viendo ejemplos aislados. Quiero descubrir sus ventajas (y también sus dificultades) mientras construyo una aplicación desde cero.</p>

        </div>
        <div class="highlight">
         <p>La idea es documentar todo el recorrido: las decisiones, los errores, los cambios de rumbo y todo lo que vaya aprendiendo durante el proceso.</p>
        </div>
      `,
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
      content: `
        <div class="section">
         <h2>La etapa que más subestimé como desarrollador</h2>
    <p>Si hay algo que cambió mucho mi forma de trabajar en los últimos años fue la importancia que hoy le doy al análisis.</p>

    <p>Durante mucho tiempo repetí el mismo patrón:</p>
    <ol>
      <li>Tenía una idea.</li>
      <li>Abría el IDE.</li>
      <li>Creaba un proyecto Spring Boot.</li>
      <li>Generaba los primeros endpoints.</li>
      <li>Y sentía que estaba avanzando.</li>
    </ol>

    <p>El problema era que, en realidad, todavía no entendía completamente qué estaba construyendo. Eso terminaba provocando exactamente lo mismo una y otra vez:</p>
    <ul>
      <li>Reescribir clases.</li>
      <li>Cambiar modelos completos.</li>
      <li>Eliminar código recién escrito.</li>
      <li>Modificar pantallas.</li>
      <li>Volver a empezar.</li>
    </ul>

    <p>No porque programara mal, sino porque estaba haciendo el análisis mientras escribía el código.</p>

    <p>Hoy intento recorrer el camino inverso: primero entender el problema, después diseñar la solución, y recién entonces empezar a programar.</p>

    <h2>¿Qué significa analizar?</h2>
    <p>Para mí, analizar un proyecto implica responder preguntas como estas:</p>
    <ul>
      <li>¿Cuál es el verdadero problema que quiero resolver?</li>
      <li>¿Qué funcionalidades tendrá la aplicación?</li>
      <li>¿Qué funcionalidades todavía no tendrá?</li>
      <li>¿Quiénes serán los usuarios?</li>
      <li>¿Qué información necesita cada uno?</li>
      <li>¿Cuáles son las reglas del negocio?</li>
    </ul>

    <p>Responder estas preguntas lleva tiempo, pero cada minuto invertido aquí suele ahorrar muchas horas de desarrollo más adelante.</p>

    <h2>La IA acelera el desarrollo, pero no reemplaza el análisis</h2>
    <p>Hoy contamos con herramientas de Inteligencia Artificial capaces de generar código en cuestión de segundos. Eso es fantástico, pero también puede llevarnos a empezar demasiado rápido.</p>

    <p>La IA puede escribir una clase, puede generar un controlador, puede crear una consulta... Lo que no puede hacer por nosotros es decidir cuál es el problema correcto que queremos resolver.</p>

    <p>Esa responsabilidad sigue siendo del desarrollador. Y, en mi opinión, es una de las habilidades más valiosas que podemos desarrollar.</p>

    <h2>Lo que ya hice antes de escribir código</h2>
    <p>Aunque todavía no implementé la lógica de negocio, el proyecto ya avanzó bastante. Durante esta etapa me dediqué a:</p>
    <ul>
      <li>Escribir las primeras ideas.</li>
      <li>Definir el alcance del producto.</li>
      <li>Identificar los distintos usuarios.</li>
      <li>Bosquejar las primeras pantallas.</li>
      <li>Pensar las entidades principales del dominio.</li>
      <li>Empezar a descubrir las reglas del negocio.</li>
    </ul>

    <p>Todo este trabajo servirá como base para las siguientes etapas.</p>

    <figure class="image-placeholder">
      <figcaption>📷 <strong>Imagen 2:</strong> </figcaption>
    </figure>

    <h2>Un pequeño spoiler</h2>
    <p>Mientras avanzaba con el análisis descubrí algo que antes pasaba completamente por alto:</p>
    <p><strong>La arquitectura no comienza cuando elegimos Spring Boot, ni cuando decidimos usar PostgreSQL o MongoDB, y mucho menos cuando creamos el primer controlador REST.</strong></p>
    
    <p><em>La arquitectura empieza entendiendo el dominio del problema.</em></p>

    <p>En los próximos capítulos voy a profundizar en conceptos como Domain-Driven Design (DDD), Lenguaje Ubicuo, Modelado del Dominio y explicar por qué decidí utilizar Arquitectura Hexagonal para este proyecto.</p>

    <p>Hoy ya no los veo como conceptos independientes. Empiezo a entender que todos forman parte de una misma idea: proteger las reglas del negocio y construir software que sea fácil de mantener y evolucionar.</p>

    <h2>¿Qué sigue?</h2>
    <p>El siguiente paso será comenzar a modelar el dominio de Fleet-FiftyFifty. Antes de pensar en frameworks, bases de datos o APIs REST, quiero asegurarme de comprender correctamente el negocio.</p>

    <p>Porque estoy convencido de que una buena aplicación no se construye empezando por la infraestructura. Se construye entendiendo primero el problema que intenta resolver.</p>

    <hr class="section-divider" />

    <p>Gracias por acompañarme en esta serie. Mi objetivo no es mostrar únicamente el resultado final, sino compartir todo el recorrido, incluyendo los errores, los cambios de opinión y los aprendizajes que aparezcan en el camino.</p>

    <p>Si tenés alguna idea o funcionalidad que te gustaría ver en <strong>Fleet-FiftyFifty</strong>, será más que bienvenida. Tal vez termine formando parte del proyecto.</p>
  </div>
        </div>
      `,
      date: '05 de agosto de 2026',
      author: 'Jorge Perello',
      tags: ['Fleet-FiftyFifty', 'Capítulo 2', 'DDD', 'Spring Boot'],
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Trae todos los posts. Si la API no tiene nada, tira de los datos de backup.
   */
  getBlogs(): Observable<Blog[]> {
    return of(this.backupBlogs);
  }

  /**
   * Busca un post por ID. Intenta en la API y si no, en el backup.
   */
  getBlogById(id: string): Observable<Blog | undefined> {
    return of(this.backupBlogs.find((b) => b.id === id));
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

  // --- Helpers de Mapeo ---

  private mapToBlog(apiPost: any): Blog {
    return {
      id: apiPost.id.toString(),
      title: apiPost.title,
      subtitle: apiPost.subtitle,
      status: apiPost.status,
      showCard: apiPost.showCard !== undefined ? apiPost.showCard : true,
      excerpt: apiPost.excerpt || apiPost.summary,
      content: apiPost.content,
      date: this.formatDate(apiPost.createdAt),
      author: apiPost.author,
      tags: apiPost.tags || [],
      chapters: apiPost.chapters || [],
    };
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return 'Fecha estelar desconocida';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

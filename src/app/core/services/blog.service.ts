import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Blog } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogs: Blog[] = [
    {
      id: 'spring-mvc-webflux-vt',
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

  constructor() { }

  getBlogs(): Observable<Blog[]> {
    return of(this.blogs);
  }

  getBlogById(id: string): Observable<Blog | undefined> {
    return of(this.blogs.find(blog => blog.id === id));
  }
}

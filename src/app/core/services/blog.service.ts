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
         </p>
          <p>(Nota: Este análisis está inspirado en pruebas reales, visita la seccion <a href="/">Mis proyectos</a> para ver ejemplos reales, incluyendo la charla de Gabriel Jiménez en Commit Conf: <a href="https://www.youtube.com/watch?v=t_FHfbfaanY" target="_blank">Ver charla en YouTube</a>)</p>
        </div>
        <h3>1. Spring MVC, es el tradicional que usamos siempre</h3>
        <p>El modelo tradicional. Cada petición entrante consume un hilo de plataforma del pool (normalmente Tomcat). Si la petición hace I/O bloqueante (como una consulta a BD o una API externa), el hilo se queda parado esperando, desperdiciando recursos valiosos.</p> El problema:
        <div class="highlight">1 request = 1 thread bloqueado esperando I/O</div>

        <h3>2. Spring WebFlux (Programación Reactiva)</h3>
        <p>Introducido para solucionar los problemas de escalabilidad del modelo bloqueante. Utiliza el paradigma de Event Loop y non-blocking I/O (modelo no bloqueante basado en eventos). Permite manejar miles de conexiones con muy pocos hilos. El <b>"coste"</b> es una curva de aprendizaje más alta y un código más complejo debido al uso de operadores como flatMap, zip, tipo de datos Flux o Mono, es un nuevo mundo para trabajar.</p>
Desventajas:
        <div class="highlight">
        - Mayor complejidad, curva de aprendizaje alta<br>
        - Dependencia de librerías reactivas, ademas tanto la base de datos como el conector deben ser reactivos<br>
      </div>
        <h3>3. Spring MVC + Virtual Threads (Java 21)</h3>
        <p>La "bala de plata" para muchos. Con Java 21, podemos usar el modelo de programación sencillo de Spring MVC (imperativo) pero sobre Virtual Threads. Cuando un hilo virtual encuentra una operación bloqueante, la JVM lo "desmonta" del hilo de plataforma real, permitiendo que otros hilos virtuales sigan ejecutándose. Obtenemos escalabilidad similar a WebFlux con la simplicidad de Spring MVC.</p>

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

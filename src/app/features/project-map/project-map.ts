import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { AnalyticsDirective } from '../../shared/analytics.directive';

interface Node {
  id: string;
  name: string;
  type: 'project' | 'experience' | 'technology';
  company?: string;
  period?: string;
  description?: string;
  stack?: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Connection {
  source: Node;
  target: Node;
  active: boolean;
}

@Component({
  selector: 'app-project-map',
  standalone: true,
  imports: [CommonModule, AnalyticsDirective],
  templateUrl: './project-map.html',
  styleUrls: ['./project-map.scss']
})
export class ProjectMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private connections: Connection[] = [];
  private animationId: number = 0;
  
  selectedNode: Node | null = null;
  projects: Project[] = [];

  private static readonly TECH_DESCRIPTIONS: Record<string, string> = {
    'Angular 21': 'Framework frontend moderno utilizando Signals reactivas, Standalone Components, nuevo Control Flow (@if/@for) y Change Detection OnPush.',
    'Angular': 'Framework frontend escalable para Single Page Applications empresariales.',
    'Signals & Computed': 'Primitivas reactivas granulares de Angular para gestión de estado síncrono, predecible y de alto rendimiento sin Zone.js.',
    'TypeScript': 'Superset tipado de JavaScript que garantiza código robusto, tipado estático y alta mantenibilidad.',
    'SCSS': 'Preprocesador de estilos con directivas modernas @use, diseño responsive, animaciones fluidas y partículas cósmicas.',
    'Java 21': 'Última versión LTS de Java con Virtual Threads (Project Loom), Record Patterns y optimizaciones avanzadas de la JVM.',
    'Spring Boot': 'Framework enterprise líder para microservicios autónomos, productivos y de alto rendimiento.',
    'Spring AI': 'Integración de modelos de Inteligencia Artificial Generativa y asistentes conversacionales con Tool Calling.',
    'Apache Kafka': 'Plataforma distribuida de streaming de eventos de alto throughput para telemetría y analíticas en tiempo real.',
    'Event-driven': 'Arquitectura orientada a eventos para procesamiento asíncrono, desacoplado y de alta resiliencia.',
    'Spring WebFlux': 'Stack web reactivo y no bloqueante basado en Project Reactor y Netty para concurrencia masiva.',
    'Virtual Threads': 'Hilos ligeros de Project Loom para manejar miles de solicitudes concurrentes de I/O sin saturar hilos del SO.',
    'Spring Batch': 'Motor de procesamiento de datos por lotes (ETL) con arquitectura en chunks, checkpoints y reintentos automáticos.',
    'Docker': 'Contenedorización para empaquetado, portabilidad y despliegues reproducibles.',
    'Kubernetes': 'Orquestación de microservicios contenerizados a escala empresarial.',
    'CI/CD': 'Integración y despliegue continuo automatizado para pipelines de calidad y producción.',
    'GitHub Actions': 'Automatización de flujos de trabajo de CI/CD, testing automatizado y despliegues.',
    'MongoDB': 'Base de datos NoSQL documental de alto rendimiento para almacenamiento ágil de eventos de analíticas.',
    'PostgreSQL': 'Sistema de gestión de bases de datos relacional y transaccional ACID avanzado.',
    'Spring Data JPA': 'Capa de persistencia relacional orientada a objetos con Hibernate y repositorios declarativos.',
    'Spring Data R2DBC': 'Driver reactivo y no bloqueante para bases de datos relacionales.',
    'H2 Database': 'Base de datos en memoria para pruebas unitarias e integración rápida de demos.',
    'DB H2 en memoria': 'Base de datos en memoria para pruebas de integración y benchmarks.',
    'Lombok': 'Librería Java para reducir boilerplate de código mediante anotaciones.',
    'JUnit 5': 'Framework moderno para pruebas unitarias, de integración y assertions.',
    'Spring Validation': 'Mecanismo declarativo de validación de datos de entrada con Bean Validation (JSR 380).',
    'Producer-Consumer Pattern': 'Patrón de diseño concurrente con colas bloqueantes para balancear carga entre hilos.',
    'Keycloak': 'Servidor de gestión de identidades y control de acceso (IAM) con OAuth 2.0 / OpenID Connect.',
    'JWT': 'JSON Web Tokens para autenticación y autorización segura sin estado (stateless).',
    'Clean Architecture': 'Diseño arquitectónico desacoplado centrado en el dominio, testeable y mantenible.',
    'SOLID': 'Principios de diseño orientado a objetos para software modular, extensible y de bajo acoplamiento.'
  };

  private experiences = [
    {
      id: 'exp0',
      name: 'Arquitecto & Dev Full Stack',
      company: 'Mi Portfolio Personal (v6)',
      period: '2026 – Actualidad',
      description: 'Ecosistema fullstack moderno y de alto rendimiento. Frontend reactivo en Angular 21 (Signals, OnPush, Control Flow), backend distribuido con microservicios en Java 21 / Spring Boot 3, telemetría y analíticas en tiempo real con Apache Kafka, Spring AI, WebFlux, Virtual Threads y Spring Batch.',
      stack: [
        'Angular 21',
        'Signals & Computed',
        'TypeScript',
        'SCSS',
        'Java 21',
        'Spring Boot',
        'Spring AI',
        'Apache Kafka',
        'Event-driven',
        'Spring WebFlux',
        'Virtual Threads',
        'Spring Batch',
        'MongoDB',
        'Docker',
        'CI/CD',
        'GitHub Actions',
        'Clean Architecture',
        'SOLID'
      ]
    },
    {
      id: 'exp1',
      name: 'Full Stack Sr.',
      company: 'Darwoft',
      period: '2024 – 2026',
      description: 'Digitalización de trámites para Claro. Microservicios en Java 21, Angular v15+, CI/CD y despliegue en Kubernetes. Implementación de IA en el proceso de desarrollo.',
      stack: ['Java 21', 'Spring Boot', 'Angular', 'Docker', 'Kubernetes', 'CI/CD', 'IA', 'Oracle', 'TypeScript', 'JUnit 5', 'Jenkins', 'OpenAPI', 'Swagger', 'SonarQube']
    },
    {
      id: 'exp2',
      name: 'Full Stack Developer',
      company: 'MAVHA – Willdom',
      period: '2020 – 2023',
      description: 'Mantenimiento de CRM para Sancor Salud. Desarrollo de microservicios con Spring Batch para envío masivo de datos. Seguridad con JWT y Keycloak.',
      stack: ['Java 8', 'Spring Boot', 'Spring Batch', 'Angular', 'JPA', 'Hibernate', 'SQL Server', 'JWT', 'Spring Security', 'Keycloak', 'Git', 'Maven', 'Scrum', 'JUnit 5']
    },
    {
      id: 'exp3',
      name: 'Full Stack Developer',
      company: 'ALAS IT',
      period: '2016 – 2019',
      description: 'Desarrollo de productos web con PHP/Laravel y React. Especialización en e-commerce con Magento 1 y 2 virtualizados en Docker.',
      stack: ['PHP', 'Laravel', 'React', 'Magento', 'Docker', 'MySQL', 'PostgreSQL', 'Linux', 'Ubuntu', 'Nginx', 'HTML', 'CSS', 'JS', 'PHPUnit']
    },
    {
      id: 'exp4',
      name: 'Analista/Desarrollador Java',
      company: 'Indra SA',
      period: '2012 – 2016',
      description: 'Desarrollo de aplicaciones empresariales monolíticas en Java 6 con JSP. Integración de sistemas mediante SOAP y arquitectura MVC.',
      stack: ['Java 6', 'Spring', 'Hibernate', 'JSP', 'SQL Server', 'SOAP', 'SVN', 'MVC', 'JBoss', 'JIRA']
    }
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.initNodes();
    });
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.startAnimation();
  }

  private initNodes() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.nodes = [];
    this.connections = [];

    const techMap = new Map<string, Node>();

    // Colores por categoría de tecnología
    const getColor = (tech: string) => {
      tech = tech.toLowerCase();
      if (tech.includes('java') || tech.includes('spring boot') || tech.includes('spring security') || tech.includes('spring validation') || tech.includes('hibernate') || tech.includes('jpa') || tech.includes('maven') || tech.includes('lombok') || tech.includes('junit')) return '#f89820'; // Java / Spring
      if (tech.includes('angular') || tech.includes('signals') || tech.includes('react') || tech.includes('js') || tech.includes('typescript') || tech.includes('css') || tech.includes('scss')) return '#dd0031'; // Frontend
      if (tech.includes('docker') || tech.includes('kubernetes') || tech.includes('ci/cd') || tech.includes('jenkins') || tech.includes('git') || tech.includes('github') || tech.includes('linux') || tech.includes('ubuntu') || tech.includes('nginx')) return '#2496ed'; // DevOps / Cloud
      if (tech.includes('sql') || tech.includes('db') || tech.includes('oracle') || tech.includes('postgres') || tech.includes('mysql') || tech.includes('mongo') || tech.includes('r2dbc') || tech.includes('h2')) return '#4479a1'; // Databases
      if (tech.includes('kafka') || tech.includes('event-driven') || tech.includes('virtual threads') || tech.includes('webflux') || tech.includes('batch') || tech.includes('producer-consumer')) return '#00c853'; // Concurrencia & Event Streaming
      if (tech.includes('ia') || tech.includes('gemini') || tech.includes('chatgpt') || tech.includes('copilot') || tech.includes('spring ai')) return '#00d2ff'; // IA & LLMs
      if (tech.includes('php') || tech.includes('laravel') || tech.includes('magento')) return '#777bb4'; // PHP
      return '#ab47bc'; // Arquitectura & Principios (Clean Architecture, SOLID, etc.)
    };

    const getTechDescription = (techName: string): string => {
      return ProjectMapComponent.TECH_DESCRIPTIONS[techName] || 
        `Tecnología clave utilizada por Jorge en el desarrollo de arquitecturas de software de alto impacto.`;
    };

    // 1. Crear nodos de Experiencia (Top)
    this.experiences.forEach((exp, i) => {
      const expNode: Node = {
        ...exp,
        type: 'experience',
        x: (width / (this.experiences.length + 1)) * (i + 1),
        y: 120,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 80,
        color: '#ffeb3b'
      };
      this.nodes.push(expNode);

      // Procesar tecnologías de esta experiencia
      exp.stack.forEach(techName => {
        let techNode = techMap.get(techName);
        if (!techNode) {
          techNode = {
            id: 'tech-' + techName,
            name: techName,
            type: 'technology',
            description: getTechDescription(techName),
            x: Math.random() * width,
            y: height / 2 + (Math.random() - 0.5) * 200, // Más dispersión vertical
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: 25,
            color: getColor(techName)
          };
          techMap.set(techName, techNode);
          this.nodes.push(techNode);
        }
        this.connections.push({ source: expNode, target: techNode, active: false });
      });
    });

    const getProjectColor = (name: string): string => {
      const n = name.toLowerCase();
      if (n.includes('kafka')) return '#00e676';
      if (n.includes('reactiv')) return '#00b0ff';
      if (n.includes('thread') || n.includes('hilo')) return '#76ff03';
      if (n.includes('batch')) return '#ff9100';
      if (n.includes('fleet')) return '#00e5ff';
      return '#38bdf8';
    };

    // 2. Crear nodos de Proyecto (Bottom)
    this.projects.forEach((p, i) => {
      const projColor = getProjectColor(p.name);
      const projNode: Node = {
        id: p.name,
        name: p.name,
        type: 'project',
        description: p.description,
        x: (width / (this.projects.length + 1)) * (i + 1),
        y: height - 120,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 35,
        color: projColor
      };
      this.nodes.push(projNode);

      // Conectar con tecnologías existentes o crear nuevas
      p.technologies.forEach(techName => {
        let techNode = techMap.get(techName);
        if (!techNode) {
          techNode = {
            id: 'tech-' + techName,
            name: techName,
            type: 'technology',
            description: getTechDescription(techName),
            x: Math.random() * width,
            y: height / 2,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: 25,
            color: getColor(techName)
          };
          techMap.set(techName, techNode);
          this.nodes.push(techNode);
        }
        this.connections.push({ source: projNode, target: techNode, active: false });
      });
    });
  }

  private startAnimation() {
    const animate = () => {
      this.updatePhysics();
      this.draw();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updatePhysics() {
    const width = this.canvasRef.nativeElement.width;
    const height = this.canvasRef.nativeElement.height;

    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      // Rozamiento sutil
      node.vx *= 0.998; 
      node.vy *= 0.998;

      // Rebote con energía
      if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.8; }
      if (node.x > width - node.radius) { node.x = width - node.radius; node.vx *= -0.8; }
      if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.8; }
      if (node.y > height - node.radius) { node.y = height - node.radius; node.vy *= -0.8; }

      // Gravedad sutil
      let targetY = height / 2;
      if (node.type === 'experience') targetY = 120;
      if (node.type === 'project') targetY = height - 120;
      
      node.vy += (targetY - node.y) * 0.0008;

      // Repulsión equilibrada
      this.nodes.forEach(other => {
        if (node === other) return;
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = node.radius + other.radius + 15;
        if (dist < minDist) {
          const force = (minDist - dist) * 0.002;
          node.vx -= dx / dist * force;
          node.vy -= dy / dist * force;
        }
      });
    });
  }

  private draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const isPortfolioSelected = this.selectedNode?.id === 'exp0' || (this.selectedNode?.type === 'experience' && this.selectedNode.company?.includes('Portfolio'));

    // Dibujar conexiones de constelación primero (atrás)
    this.connections.forEach(conn => {
      let isActive = conn.active;
      if (this.selectedNode) {
        if (isPortfolioSelected) {
          // Si el portfolio está seleccionado, se activan todas las líneas hacia y desde proyectos y lunas del portfolio
          isActive = (
            conn.source === this.selectedNode || 
            conn.target === this.selectedNode ||
            conn.source.type === 'project' || 
            conn.target.type === 'project'
          );
        } else {
          isActive = (this.selectedNode === conn.source || this.selectedNode === conn.target);
        }
      }

      this.ctx.beginPath();
      this.ctx.moveTo(conn.source.x, conn.source.y);
      this.ctx.lineTo(conn.target.x, conn.target.y);
      this.ctx.strokeStyle = isActive ? conn.target.color : 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = isActive ? 2.2 : 0.6;
      this.ctx.stroke();
    });

    // Dibujar cuerpos celestes (Estrellas, Planetas, Lunas)
    this.nodes.forEach(node => {
      const isHighlighted = this.selectedNode === node || this.isConnected(node, this.selectedNode);
      this.drawCelestialBody(node, isHighlighted);
    });
  }

  /**
   * Renderizado artístico de cuerpos celestes con iluminación 3D, coronas de plasma y atmósferas
   */
  private drawCelestialBody(node: Node, isHighlighted: boolean) {
    const ctx = this.ctx;
    const { x, y, radius, type, color } = node;

    if (type === 'experience') {
      // ☀️ ESTRELLA / SOL GIGANTE (Experiencia Profesional)
      // 1. Corona / Halo de plasma exterior
      const coronaGrad = ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius * 1.4);
      coronaGrad.addColorStop(0, 'rgba(255, 224, 130, 0.4)');
      coronaGrad.addColorStop(0.4, 'rgba(255, 152, 0, 0.2)');
      coronaGrad.addColorStop(0.8, 'rgba(230, 81, 0, 0.08)');
      coronaGrad.addColorStop(1, 'rgba(230, 81, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = coronaGrad;
      ctx.fill();

      // 2. Esfera Estelar (Gradiente de Fusión Nuclear 3D)
      const starGrad = ctx.createRadialGradient(
        x - radius * 0.25, y - radius * 0.25, radius * 0.05,
        x, y, radius
      );
      starGrad.addColorStop(0, '#ffffff');       // Núcleo incandescente blanco
      starGrad.addColorStop(0.2, '#fff9c4');     // Plasma estelar luminoso
      starGrad.addColorStop(0.55, '#fbc02d');    // Superficie dorada
      starGrad.addColorStop(0.85, '#f57c00');    // Borde de cromosfera
      starGrad.addColorStop(1, '#bf360c');       // Limbo solar profundo

      ctx.save();
      if (isHighlighted) {
        ctx.shadowBlur = 35;
        ctx.shadowColor = '#ffd700';
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = starGrad;
      ctx.fill();
      ctx.restore();

      // Anillo de fuego perimetral
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
      ctx.stroke();

      // Tipografía de la Estrella
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(node.company || '', x, y - 5);
      ctx.font = 'bold 9px Arial';
      ctx.fillText(node.name, x, y + 12);

    } else if (type === 'project') {
      // 🪐 PLANETA MAYOR (Proyecto Portfolio)
      // 1. Halo atmosférico planetario
      const atmoGrad = ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius * 1.3);
      atmoGrad.addColorStop(0, this.hexToRgba(color, 0.35));
      atmoGrad.addColorStop(0.6, this.hexToRgba(color, 0.1));
      atmoGrad.addColorStop(1, this.hexToRgba(color, 0));
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = atmoGrad;
      ctx.fill();

      // 2. Esfera Planetaria 3D (Iluminación cenital / lateral)
      const planetGrad = ctx.createRadialGradient(
        x - radius * 0.35, y - radius * 0.35, radius * 0.05,
        x, y, radius
      );
      planetGrad.addColorStop(0, '#ffffff');                     // Reflejo especular
      planetGrad.addColorStop(0.25, this.lightenColor(color, 0.4)); // Atmósfera clara
      planetGrad.addColorStop(0.6, color);                       // Superficie del planeta
      planetGrad.addColorStop(0.88, this.darkenColor(color, 0.35)); // Lado nocturno
      planetGrad.addColorStop(1, '#020617');                     // Sombra del limbo espacial

      ctx.save();
      if (isHighlighted) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();
      ctx.restore();

      // Borde de atmósfera luminosa
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isHighlighted ? '#ffffff' : this.hexToRgba(color, 0.6);
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();

      // Nombre del Planeta con sombra para máxima legibilidad
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 9px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 5;
      ctx.fillText(node.name, x, y + 4);
      ctx.restore();

    } else {
      // 🌕 LUNA / SATÉLITE TECNOLÓGICO (Habilidades)
      // 1. Gradiente esférico 3D lunar
      const moonGrad = ctx.createRadialGradient(
        x - radius * 0.35, y - radius * 0.35, radius * 0.05,
        x, y, radius
      );
      moonGrad.addColorStop(0, '#ffffff');                     // Punto de luz polar
      moonGrad.addColorStop(0.3, this.lightenColor(color, 0.3)); // Brillo lunar
      moonGrad.addColorStop(0.6, color);                       // Tono característico
      moonGrad.addColorStop(0.85, this.darkenColor(color, 0.4)); // Cráteres / Penumbra
      moonGrad.addColorStop(1, '#05070e');                     // Lado oscuro de la luna

      ctx.save();
      if (isHighlighted) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();
      ctx.restore();

      // Borde lunar sutil
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isHighlighted ? color : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isHighlighted ? 1.8 : 0.6;
      ctx.stroke();

      // Nombre de la Luna
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 8.5px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 4;
      ctx.fillText(node.name, x, y + 3.5);
      ctx.restore();
    }
  }

  private darkenColor(hex: string, factor: number): string {
    if (!hex.startsWith('#') || hex.length < 7) return '#0a0a14';
    const r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
    const g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
    const b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private lightenColor(hex: string, factor: number): string {
    if (!hex.startsWith('#') || hex.length < 7) return '#e0f2fe';
    const r = Math.min(255, Math.floor(parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    if (!hex.startsWith('#') || hex.length < 7) return `rgba(79, 172, 254, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private isConnected(node1: Node, node2: Node | null): boolean {
    if (!node2) return false;

    // Si el nodo seleccionado es el Portfolio Personal (exp0),
    // todos los planetas de proyectos y sus lunas tecnológicas quedan interconectados y resaltados
    const isPortfolioSelected = node2.id === 'exp0' || (node2.type === 'experience' && node2.company?.includes('Portfolio'));
    if (isPortfolioSelected) {
      if (node1.type === 'project') return true;
      return this.connections.some(c => 
        (c.source === node2 && c.target === node1) || 
        (c.source === node1 && c.target === node2) ||
        (c.source.type === 'project' && c.target === node1) ||
        (c.target.type === 'project' && c.source === node1)
      );
    }

    // Si se selecciona un planeta de proyecto, se resalta su conexión con la estrella del Portfolio
    if (node2.type === 'project' && (node1.id === 'exp0' || (node1.type === 'experience' && node1.company?.includes('Portfolio')))) {
      return true;
    }

    return this.connections.some(c => 
      (c.source === node1 && c.target === node2) || 
      (c.source === node2 && c.target === node1)
    );
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  handleCanvasClick(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let found = false;
    this.nodes.forEach(node => {
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist < node.radius) {
        this.selectNode(node);
        found = true;
      }
    });

    if (!found) {
      this.selectedNode = null;
      this.connections.forEach(c => c.active = false);
    }
  }

  private selectNode(node: Node) {
    this.selectedNode = node;
    const isPortfolio = node.id === 'exp0' || (node.type === 'experience' && node.company?.includes('Portfolio'));

    this.connections.forEach(conn => {
      if (isPortfolio) {
        conn.active = (
          conn.source === node || 
          conn.target === node || 
          conn.source.type === 'project' || 
          conn.target.type === 'project'
        );
      } else {
        conn.active = (conn.source === node || conn.target === node);
      }
    });
  }
}

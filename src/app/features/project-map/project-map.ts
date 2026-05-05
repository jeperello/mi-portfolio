import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

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
  imports: [CommonModule],
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

  private experiences = [
    {
      id: 'exp0',
      name: 'Arquitecto & Dev',
      company: 'Mi Portfolio Personal',
      period: '2026 – Actualidad',
      description: 'Ecosistema de microservicios para demostración de capacidades técnicas. Implementación de Spring AI, WebFlux, Virtual Threads y Arquitectura Limpia.',
      stack: ['Java 21', 'Spring Boot', 'Spring AI', 'WebFlux', 'Virtual Threads', 'Angular', 'Docker', 'CI/CD', 'TypeScript', 'SCSS']
    },
    {
      id: 'exp1',
      name: 'Full Stack Sr.',
      company: 'Darwoft',
      period: '2024 – 2026',
      description: 'Digitalización de trámites para Claro. Microservicios en Java 21, Angular v15+, CI/CD y despliegue en Kubernetes. Implementación de IA en el proceso de desarrollo.',
      stack: ['Java 21', 'Spring Boot', 'Angular', 'Docker', 'Kubernetes', 'CI/CD', 'IA', 'Oracle', 'TypeScript', 'Junit 5', 'Jenkins', 'OpenAPI', 'Swagger', 'SonarQube']
    },
    {
      id: 'exp2',
      name: 'Full Stack Developer',
      company: 'MAVHA – Willdom',
      period: '2020 – 2023',
      description: 'Mantenimiento de CRM para Sancor Salud. Desarrollo de microservicios con Spring Batch para envío masivo de datos. Seguridad con JWT y Keycloak.',
      stack: ['Java 8', 'Spring Boot', 'Spring Batch', 'Angular', 'JPA', 'Hibernate', 'SQL Server', 'JWT', 'Spring Security', 'Keycloak', 'Git', 'Maven', 'Scrum', 'Junit']
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
      if (tech.includes('java') || tech.includes('spring') || tech.includes('hibernate') || tech.includes('maven')) return '#f89820'; // Java/Spring
      if (tech.includes('angular') || tech.includes('react') || tech.includes('js') || tech.includes('typescript') || tech.includes('css')) return '#dd0031'; // Frontend
      if (tech.includes('docker') || tech.includes('kubernetes') || tech.includes('ci/cd') || tech.includes('jenkins') || tech.includes('git')) return '#2496ed'; // DevOps
      if (tech.includes('sql') || tech.includes('db') || tech.includes('oracle') || tech.includes('postgres') || tech.includes('mysql')) return '#4479a1'; // DB
      if (tech.includes('ia') || tech.includes('gemini') || tech.includes('chatgpt') || tech.includes('copilot')) return '#4facfe'; // IA
      if (tech.includes('php') || tech.includes('laravel') || tech.includes('magento')) return '#777bb4'; // PHP
      return '#9c27b0'; // Otros
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
            description: `Tecnología utilizada por Jorge en proyectos profesionales de alto nivel.`,
            x: Math.random() * width,
            y: height / 2 + (Math.random() - 0.5) * 200, // Más dispersión vertical
            vx: (Math.random() - 0.5) * 0.7, // Punto medio: 0.7 (antes 0.4 zombie, 1.0 tormenta)
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

    // 2. Crear nodos de Proyecto (Bottom)
    this.projects.forEach((p, i) => {
      const projNode: Node = {
        id: p.name,
        name: p.name,
        type: 'project',
        description: p.description,
        x: (width / (this.projects.length + 1)) * (i + 1),
        y: height - 120,
        vx: (Math.random() - 0.5) * 0.5, // Un poquito más de vida
        vy: (Math.random() - 0.5) * 0.5,
        radius: 35,
        color: '#ffffff'
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

      // Rozamiento mucho más sutil para que no parezcan zombies
      node.vx *= 0.998; 
      node.vy *= 0.998;

      // Rebote con más energía (elasticidad)
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

    // Dibujar conexiones primero (atrás)
    this.connections.forEach(conn => {
      const isActive = conn.active || (this.selectedNode === conn.source || this.selectedNode === conn.target);
      this.ctx.beginPath();
      this.ctx.moveTo(conn.source.x, conn.source.y);
      this.ctx.lineTo(conn.target.x, conn.target.y);
      this.ctx.strokeStyle = isActive ? conn.target.color : 'rgba(255, 255, 255, 0.03)';
      this.ctx.lineWidth = isActive ? 2 : 0.5;
      this.ctx.stroke();
    });

    // Dibujar nodos
    this.nodes.forEach(node => {
      const isHighlighted = this.selectedNode === node || this.isConnected(node, this.selectedNode);
      
      if (isHighlighted) {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = node.color;
      }

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Texto dentro del nodo
      this.ctx.fillStyle = (node.color === '#ffffff' || node.color === '#ffeb3b') ? '#000' : '#fff';
      this.ctx.textAlign = 'center';
      
      if (node.type === 'experience') {
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillText(node.company || '', node.x, node.y - 5);
        this.ctx.font = '9px Arial';
        this.ctx.fillText(node.name, node.x, node.y + 12);
      } else {
        this.ctx.font = 'bold 9px Arial';
        this.ctx.fillText(node.name, node.x, node.y + 4);
      }
    });
  }

  private isConnected(node1: Node, node2: Node | null): boolean {
    if (!node2) return false;
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
    this.connections.forEach(conn => {
      conn.active = (conn.source === node || conn.target === node);
    });
  }
}

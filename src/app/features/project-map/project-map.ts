import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

interface Node {
  id: string;
  name: string;
  type: 'project' | 'concept' | 'experience';
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
      stack: ['Java 21', 'Spring Boot', 'Spring AI', 'WebFlux', 'Virtual Threads', 'Angular', 'Docker', 'CI/CD']
    },
    {
      id: 'exp1',
      name: 'Full Stack Sr.',
      company: 'Darwoft',
      period: '2024 – 2026',
      description: 'Digitalización de trámites para Claro. Microservicios en Java 21, Angular v15+, CI/CD y despliegue en Kubernetes. Implementación de IA en el proceso de desarrollo.',
      stack: ['Java 21', 'Spring Boot', 'Angular', 'Docker', 'Kubernetes', 'CI/CD', 'IA', 'Oracle']
    },
    {
      id: 'exp2',
      name: 'Full Stack Developer',
      company: 'MAVHA – Willdom',
      period: '2020 – 2023',
      description: 'Mantenimiento de CRM para Sancor Salud. Desarrollo de microservicios con Spring Batch para envío masivo de datos. Seguridad con JWT y Keycloak.',
      stack: ['Java 8', 'Spring Boot', 'Spring Batch', 'Angular', 'SQL Server', 'JWT', 'Security']
    },
    {
      id: 'exp3',
      name: 'Full Stack Developer',
      company: 'ALAS IT',
      period: '2016 – 2019',
      description: 'Desarrollo de productos web con PHP/Laravel y React. Especialización en e-commerce con Magento 1 y 2 virtualizados en Docker.',
      stack: ['PHP', 'Laravel', 'React', 'Magento', 'Docker', 'MySQL', 'PostgreSQL']
    },
    {
      id: 'exp4',
      name: 'Analista/Desarrollador Java',
      company: 'Indra SA',
      period: '2012 – 2016',
      description: 'Desarrollo de aplicaciones empresariales monolíticas en Java 6 con JSP. Integración de sistemas mediante SOAP y arquitectura MVC.',
      stack: ['Java 6', 'Spring', 'Hibernate', 'JSP', 'SQL Server', 'SOAP']
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

    // 1. Conceptos Tecnológicos (Centros de Gravedad)
    const concepts = [
      { id: 'c1', name: 'Java 21/Loom', color: '#f89820' },
      { id: 'c2', name: 'Spring Ecosystem', color: '#6db33f' },
      { id: 'c3', name: 'Frontend (Angular/React)', color: '#dd0031' },
      { id: 'c4', name: 'IA & Prompts', color: '#4facfe' },
      { id: 'c5', name: 'DevOps & Docker', color: '#2496ed' },
      { id: 'c6', name: 'Legacy & Migrations', color: '#9c27b0' }
    ];

    concepts.forEach((c, i) => {
      this.nodes.push({
        ...c,
        type: 'concept',
        x: (width / (concepts.length + 1)) * (i + 1),
        y: height / 2,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: 45,
        color: c.color
      });
    });

    // 2. Experiencias Laborales (Nodos de Órbita Superior)
    this.experiences.forEach((exp, i) => {
      const expNode: Node = {
        ...exp,
        type: 'experience',
        x: (width / (this.experiences.length + 1)) * (i + 1),
        y: 150,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 85, 
        color: '#ffeb3b'
      };
      this.nodes.push(expNode);

      // Conectar experiencias con conceptos
      this.nodes.forEach(node => {
        if (node.type === 'concept') {
          const matches = exp.stack.some(s => 
            s.toLowerCase().includes(node.name.split(' ')[0].toLowerCase()) ||
            (node.id === 'c6' && (exp.company === 'Indra SA' || exp.company === 'ALAS IT')) ||
            (node.id === 'c4' && exp.stack.includes('IA'))
          );
          if (matches) {
            this.connections.push({ source: node, target: expNode, active: false });
          }
        }
      });
    });

    // 3. Proyectos del Portfolio (Nodos de Órbita Inferior)
    this.projects.forEach((p, i) => {
      const projectNode: Node = {
        id: p.name,
        name: p.name,
        type: 'project',
        description: p.description,
        stack: p.technologies,
        x: (width / (this.projects.length + 1)) * (i + 1),
        y: height - 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 30,
        color: '#ffffff'
      };
      this.nodes.push(projectNode);

      // Conectar proyectos con conceptos
      this.nodes.forEach(node => {
        if (node.type === 'concept') {
          const matches = p.technologies.some(t => 
            t.toLowerCase().includes(node.name.split('/')[0].toLowerCase()) ||
            (node.id === 'c1' && (p.name.includes('Threads') || p.name.includes('Reactive')))
          );
          if (matches) {
            this.connections.push({ source: node, target: projectNode, active: false });
          }
        }
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

      // Rebote suave
      if (node.x < node.radius || node.x > width - node.radius) node.vx *= -0.8;
      if (node.y < node.radius || node.y > height - node.radius) node.vy *= -0.8;

      // Mantener en su zona vertical según tipo
      let targetY = height / 2;
      if (node.type === 'experience') targetY = 150;
      if (node.type === 'project') targetY = height - 200;
      
      node.vy += (targetY - node.y) * 0.001;
    });
  }

  private draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.connections.forEach(conn => {
      this.ctx.beginPath();
      this.ctx.moveTo(conn.source.x, conn.source.y);
      this.ctx.lineTo(conn.target.x, conn.target.y);
      this.ctx.strokeStyle = conn.active ? conn.source.color : 'rgba(255, 255, 255, 0.05)';
      this.ctx.lineWidth = conn.active ? 3 : 1;
      this.ctx.stroke();
    });

    this.nodes.forEach(node => {
      // Glow effect
      if (this.selectedNode === node || (this.selectedNode?.type === 'concept' && this.isConnected(node, this.selectedNode))) {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = node.color;
      }

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      this.ctx.fill();
      
      this.ctx.shadowBlur = 0;

      // Texto
      this.ctx.fillStyle = (node.color === '#ffffff' || node.color === '#ffeb3b') ? '#000' : '#fff';
      this.ctx.textAlign = 'center';
      
      if (node.type === 'experience') {
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText(node.company || '', node.x, node.y - 5);
        this.ctx.font = '10px Arial';
        this.ctx.fillText(node.name, node.x, node.y + 12);
      } else {
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillText(node.name, node.x, node.y + 5);
      }
    });
  }

  private isConnected(node1: Node, node2: Node): boolean {
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

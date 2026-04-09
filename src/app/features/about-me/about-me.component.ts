import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-me.html',
  styleUrls: ['./about-me.scss']
})
export class AboutMeComponent implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    // Configuramos el observador
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cuando el elemento entra en vista, añadimos la clase 'active'
          entry.target.classList.add('active');
          // Dejamos de observar este elemento para ahorrar recursos
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 }); // Se activa cuando el 15% del elemento es visible

    // Buscamos todos los elementos con la clase .reveal y los observamos
    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((reveal: HTMLElement) => observer.observe(reveal));
  }
}
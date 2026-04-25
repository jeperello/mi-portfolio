import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './features/chat/chat';
import { NavbarComponent } from './shared/navbar.component';
import { IntroComponent } from './shared/intro/intro';
import { ApiWarmingService } from './core/services/api-warming.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, NavbarComponent, IntroComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio-fullstack');
  private warmingService = inject(ApiWarmingService);
  
  showIntro = true;

  ngOnInit(): void {
    // Despertamos las APIs de forma silenciosa al arrancar
    this.warmingService.warmUpAll();
  }

  onIntroFinished() {
    this.showIntro = false;
  }
}

import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './features/chat/chat';
import { NavbarComponent } from './shared/navbar.component';
import { ApiWarmingService } from './core/services/api-warming.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio-fullstack');
  private warmingService = inject(ApiWarmingService);

  ngOnInit(): void {
    // Despertamos las APIs de forma silenciosa al arrancar
    this.warmingService.warmUpAll();
  }
}

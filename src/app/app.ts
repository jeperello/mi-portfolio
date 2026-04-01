import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './features/chat/chat';
import { NavbarComponent } from './shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-fullstack');
}

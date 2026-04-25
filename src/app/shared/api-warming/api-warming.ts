import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-warming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-warming.html',
  styleUrls: ['./api-warming.scss']
})
export class ApiWarmingComponent {
  @Input() mainMessage: string = 'Despertando la API de Java...';
  @Input() subMessage: string = 'Estaba hibernando para ahorrar energía ☕';
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-me.html',
  styleUrls: ['./about-me.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMeComponent {
}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public showBlogTooltip = signal(false);


  ngOnInit(): void {
    // Mostramos el tooltip después de 2.5 segundos
    setTimeout(() => {
      this.showBlogTooltip.set(true);

      // Lo ocultamos automáticamente tras 9 segundos
      setTimeout(() => {
        if (this.showBlogTooltip()) {
          this.showBlogTooltip.set(false);
        }
      }, 9000);
    }, 2500);
  }

  hideTooltip(): void {
    if (this.showBlogTooltip()) {
      this.showBlogTooltip.set(false);
    }
  }
}
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-expandable-description',
  standalone: true,
  imports: [],
  templateUrl: './expandable-description.component.html',
  styleUrls: ['./expandable-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableDescriptionComponent {
  /** Texto del botón cuando está contraído */
  public readonly label = input<string>('Ver descripción');

  /** Texto del botón cuando está expandido */
  public readonly expandedLabel = input<string>('Ocultar descripción');

  /** Texto opcional si se pasa directamente como input en vez de ng-content */
  public readonly text = input<string>('');

  /** Estado reactivo del acordeón (por defecto contraído) */
  public readonly isExpanded = signal<boolean>(false);

  /** Alterna la apertura o cierre de la descripción */
  public toggle(): void {
    this.isExpanded.update(v => !v);
  }
}

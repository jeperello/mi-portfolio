import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

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

  /** Fuerza la apertura de la descripción mientras el estado de carga está activo */
  public readonly forceOpen = input<boolean>(false);

  /** Estado manual del acordeón cuando no hay forzado de apertura */
  private readonly isManualExpanded = signal<boolean>(false);

  /** Estado reactivo final del acordeón */
  public readonly isExpanded = computed<boolean>(() => this.forceOpen() || this.isManualExpanded());

  /** Alterna la apertura o cierre de la descripción */
  public toggle(): void {
    if (this.forceOpen()) {
      return;
    }

    this.isManualExpanded.update(v => !v);
  }
}

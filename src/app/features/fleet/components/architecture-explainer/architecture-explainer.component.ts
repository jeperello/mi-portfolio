import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architecture-explainer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-card explainer-card">
      <div class="card-header-bar">
        <div>
          <h3>🎓 Tutorial Técnico: Matemática del Dominio y Principios SOLID</h3>
          <p class="subtitle">Comprendiendo el "por qué" de cada decisión arquitectónica en Angular 21</p>
        </div>
        <div class="tab-buttons">
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'math'"
            (click)="activeTab.set('math')">
            🧮 1. Desglose Matemático
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'solid'"
            (click)="activeTab.set('solid')">
            🏛️ 2. Principios SOLID
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'signals'"
            (click)="activeTab.set('signals')">
            ⚡ 3. Angular 21 Signals
          </button>
        </div>
      </div>

      <!-- Tab 1: Desglose Matemático -->
      @if (activeTab() === 'math') {
        <div class="tab-content">
          <div class="section-badge">PASO A PASO DE LA LIQUIDACIÓN REAL</div>
          <p class="intro-p">
            La nota manuscrita original registraba valores repartidos entre billeteras virtuales, efectivo y cuentas bancarias. El módulo unifica la caja y efectúa el finiquito de manera exacta:
          </p>

          <div class="step-cards">
            <!-- Paso 1 -->
            <div class="step-card">
              <div class="step-num">Paso 1</div>
              <h4>Consolidación por Plataforma</h4>
              <ul>
                <li><strong>DiDi:</strong> $2,000 (Banco) + $50,000 (Efectivo) + $26,000 (MP) = <strong>$78,000.00</strong></li>
                <li><strong>Uber:</strong> $27,000 (Efectivo) + $36,000 (Banco) = <strong>$63,000.00</strong></li>
              </ul>
            </div>

            <!-- Paso 2 -->
            <div class="step-card">
              <div class="step-num">Paso 2</div>
              <h4>Recaudación Real por Socio</h4>
              <ul>
                <li><strong>Propietario:</strong> $2,000 (DiDi) + $36,000 (Uber) = <strong>$38,000.00</strong></li>
                <li><strong>Conductor:</strong> $76,000 (DiDi) + $27,000 (Uber) = <strong>$103,000.00</strong></li>
              </ul>
            </div>

            <!-- Paso 3 -->
            <div class="step-card">
              <div class="step-num">Paso 3</div>
              <h4>Gran Total y Target 50/50</h4>
              <ul>
                <li><strong>Total Flota:</strong> $78,000 + $63,000 = <strong>$141,000.00</strong></li>
                <li><strong>Cuota Justa (50%):</strong> $141,000 / 2 = <strong>$70,500.00 cada uno</strong></li>
              </ul>
            </div>

            <!-- Paso 4 -->
            <div class="step-card highlight-step">
              <div class="step-num">Paso 4</div>
              <h4>Cálculo del Finiquito / Saldo</h4>
              <ul>
                <li><strong>Conductor:</strong> Recaudó $103,000. Su cuota justa es $70,500. Tiene un exceso de <strong>+$32,500.00 (Deudor)</strong>.</li>
                <li><strong>Propietario:</strong> Recaudó $38,000. Su cuota justa es $70,500. Le faltan <strong>-$32,500.00 (Acreedor)</strong>.</li>
                <li><strong>Resultado Final:</strong> Conductor transfiere $32,500.00 al Propietario. Cuentas saldadas al 50%.</li>
              </ul>
            </div>
          </div>
        </div>
      }

      <!-- Tab 2: Principios SOLID -->
      @if (activeTab() === 'solid') {
        <div class="tab-content">
          <div class="solid-grid">
            <div class="solid-card">
              <div class="letter">S</div>
              <div class="solid-info">
                <h4>Single Responsibility Principle (SRP)</h4>
                <p>
                  <code>FleetCalculatorService</code> se encarga <em>únicamente</em> del cálculo matemático puro de finiquito. 
                  <code>FleetStateService</code> gestiona el estado reactivo de las transacciones. Los componentes visuales solo renderizan la UI.
                </p>
              </div>
            </div>

            <div class="solid-card">
              <div class="letter">O</div>
              <div class="solid-info">
                <h4>Open/Closed Principle (OCP)</h4>
                <p>
                  El motor de cálculo acepta dinámicamente nuevas plataformas (ej. Cabify, InDrive), nuevos métodos de pago o porcentajes de reparto sin modificar el código interno de liquidación.
                </p>
              </div>
            </div>

            <div class="solid-card">
              <div class="letter">L</div>
              <div class="solid-info">
                <h4>Liskov Substitution Principle (LSP)</h4>
                <p>
                  Todas las estructuras de datos (<code>IncomeEntry</code>, <code>PlatformSubtotal</code>, <code>SettlementResult</code>) cumplen contratos estrictos e inmutables garantizados por TypeScript.
                </p>
              </div>
            </div>

            <div class="solid-card">
              <div class="letter">I</div>
              <div class="solid-info">
                <h4>Interface Segregation Principle (ISP)</h4>
                <p>
                  Los componentes tontos (presentacionales) reciben únicamente los inputs exactos que necesitan mediante <code>input.required&lt;T&gt;()</code>, evitando pasar objetos globales pesados.
                </p>
              </div>
            </div>

            <div class="solid-card">
              <div class="letter">D</div>
              <div class="solid-info">
                <h4>Dependency Inversion Principle (DIP)</h4>
                <p>
                  Los servicios se inyectan usando la función moderna <code>inject()</code> de Angular 21, desacoplando dependencias y facilitando pruebas unitarias.
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tab 3: Signals y Rendimiento Angular 21 -->
      @if (activeTab() === 'signals') {
        <div class="tab-content">
          <div class="signals-info-box">
            <h4>⚡ Reactividad Ultra Rápida con Signals y OnPush</h4>
            <p>
              Angular 21 reemplaza los patrones reactivos complejos por <strong>Signals</strong> de grano fino. En esta solución:
            </p>
            <div class="code-snippets">
              <div class="snippet">
                <span class="snippet-title">1. Estado Fuente:</span>
                <pre><code>private entriesSignal = signal&lt;IncomeEntry[]&gt;(PRESET);</code></pre>
              </div>
              <div class="snippet">
                <span class="snippet-title">2. Derivaciones Automáticas (Computed):</span>
                <pre><code>public readonly settlement = computed(() =>
  this.calculator.calculateSettlement(this.entriesSignal(), this.splitPercentage())
);</code></pre>
              </div>
              <div class="snippet">
                <span class="snippet-title">3. ChangeDetectionStrategy.OnPush:</span>
                <p>
                  Cada componente utiliza <code>OnPush</code>. Cuando agregan o eliminan un ingreso, solo la sub-gráfica y el card afectado se actualizan en el DOM sin ciclos de detección de cambios innecesarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .explainer-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 20px;
      padding: 1.75rem;
      margin-top: 2.5rem;
    }

    .card-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border-color, #334155);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;

      h3 {
        margin: 0 0 0.3rem 0;
        font-size: 1.35rem;
        color: #38bdf8;
      }
    }

    .subtitle {
      margin: 0;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .tab-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-color, #334155);
      color: #94a3b8;
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #f1f5f9;
        border-color: #38bdf8;
      }

      &.active {
        background: #38bdf8;
        color: #0f172a;
        border-color: #38bdf8;
        font-weight: 700;
      }
    }

    .section-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      margin-bottom: 0.75rem;
    }

    .intro-p {
      font-size: 0.9rem;
      color: #cbd5e1;
      margin-bottom: 1.25rem;
    }

    .step-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .step-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(51, 65, 85, 0.8);
      border-radius: 12px;
      padding: 1rem;

      h4 {
        margin: 0.3rem 0 0.6rem 0;
        font-size: 1rem;
        color: #f1f5f9;
      }

      ul {
        margin: 0;
        padding-left: 1.2rem;
        font-size: 0.8rem;
        color: #cbd5e1;

        li {
          margin-bottom: 0.4rem;
        }
      }
    }

    .step-num {
      font-size: 0.7rem;
      font-weight: 800;
      color: #818cf8;
      text-transform: uppercase;
    }

    .highlight-step {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);

      .step-num {
        color: #38bdf8;
      }
    }

    /* SOLID Grid */
    .solid-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .solid-card {
      display: flex;
      align-items: flex-start;
      gap: 1.2rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.6);
      padding: 1rem 1.2rem;
      border-radius: 12px;

      .letter {
        font-size: 2rem;
        font-weight: 900;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        flex-shrink: 0;
      }

      h4 {
        margin: 0 0 0.3rem 0;
        font-size: 1.05rem;
        color: #f1f5f9;
      }

      p {
        margin: 0;
        font-size: 0.85rem;
        color: #94a3b8;
        line-height: 1.4;

        code {
          color: #38bdf8;
          font-family: monospace;
        }
      }
    }

    /* Signals Info */
    .signals-info-box {
      h4 {
        margin: 0 0 0.5rem 0;
        color: #34d399;
        font-size: 1.1rem;
      }

      p {
        font-size: 0.9rem;
        color: #cbd5e1;
        margin-bottom: 1rem;
      }
    }

    .code-snippets {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .snippet {
      background: #0f172a;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #334155;

      .snippet-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: #38bdf8;
        display: block;
        margin-bottom: 0.4rem;
      }

      pre {
        margin: 0;
        code {
          color: #f1f5f9;
          font-family: monospace;
          font-size: 0.85rem;
        }
      }

      p {
        margin: 0.4rem 0 0 0;
        font-size: 0.8rem;
        color: #94a3b8;
      }
    }
  `]
})
export class ArchitectureExplainerComponent {
  activeTab = signal<'math' | 'solid' | 'signals'>('math');
}

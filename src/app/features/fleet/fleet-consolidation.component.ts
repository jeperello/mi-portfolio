import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FleetStateService } from './services/fleet-state.service';
import { FleetKpiComponent } from './components/fleet-kpi/fleet-kpi.component';
import { SettlementCardComponent } from './components/settlement-card/settlement-card.component';
import { PlatformBreakdownComponent } from './components/platform-breakdown/platform-breakdown.component';
import { PartnerBreakdownComponent } from './components/partner-breakdown/partner-breakdown.component';
import { IncomeTableComponent } from './components/income-table/income-table.component';
import { IncomeFormComponent } from './components/income-form/income-form.component';
import { ArchitectureExplainerComponent } from './components/architecture-explainer/architecture-explainer.component';
import { IncomeEntry } from './models/fleet.model';

@Component({
  selector: 'app-fleet-consolidation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FleetKpiComponent,
    SettlementCardComponent,
    PlatformBreakdownComponent,
    PartnerBreakdownComponent,
    IncomeTableComponent,
    IncomeFormComponent,
    ArchitectureExplainerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="api-showcase fleet-container">
      <!-- Header Bar -->
      <div class="description-row header-section">
        <div class="top-nav-bar">
          <a routerLink="/" class="back-link">
            ← Volver a Proyectos
          </a>
        </div>

        <div class="title-badge-wrap">
          <span class="module-chip">🚖 Fleet-FiftyFifty</span>
          <h1>Consolidación de Ingresos Semanales</h1>
          <p class="subtitle-text">
            Módulo de liquidación y finiquito 50/50 entre socios de la flota. Calculado reactivamente con Signals en Angular 21.
          </p>
        </div>

        <!-- Note Preset Notification Banner -->
        <div class="preset-banner" [class.is-empty]="fleetState.entryCount() === 0">
          <div class="banner-left">
            <span class="banner-icon">{{ fleetState.entryCount() === 0 ? '⚡' : '📝' }}</span>
            <div>
              @if (fleetState.entryCount() === 0) {
                <strong>Módulo listo en $0.00 (Sin transacciones)</strong>
                <p>Haz clic en "Generar datos de prueba" para poblar los registros de la nota manuscrita o añade ingresos manualmente.</p>
              } @else {
                <strong>Datos de prueba cargados ({{ fleetState.entryCount() }} registros)</strong>
                <p>Recaudación total: {{ fleetState.grandTotal() | currency:'USD':'symbol':'1.2-2' }} | Finiquito 50/50 calculado automáticamente</p>
              }
            </div>
          </div>
          <div class="banner-actions">
            <button class="btn-reload" (click)="fleetState.generateTestData()">
              ✨ Generar datos de prueba
            </button>
            @if (fleetState.entryCount() > 0) {
              <button class="btn-clear" (click)="fleetState.clearAllEntries()">
                🗑️ Limpiar todo
              </button>
            }
          </div>
        </div>
      </div>

      <!-- 1. Tabla de Transacciones Registradas -->
      <app-income-table 
        [entries]="fleetState.entries()"
        (onRemoveEntry)="handleRemoveEntry($event)"
        (onReloadPreset)="fleetState.generateTestData()"
      />

      <!-- 2. Formulario interactivo para agregar nuevos ingresos -->
      <app-income-form 
        (onAddEntry)="handleAddEntry($event)"
      />

      <!-- 3. KPIs principales de la Flota -->
      <app-fleet-kpi 
        [grandTotal]="fleetState.grandTotal()"
        [fairShare]="fleetState.settlement().fairSharePerPartner"
        [propietarioTotal]="propietarioCollected()"
        [conductorTotal]="conductorCollected()"
      />

      <!-- 4. Tarjeta Héroe del Finiquito (Resultado de Liquidación 50/50) -->
      <app-settlement-card 
        [settlement]="fleetState.settlement()"
        [propietarioCollected]="propietarioCollected()"
        [conductorCollected]="conductorCollected()"
      />

      <!-- 5. Desglose por Plataforma y por Socio (Grid 2 Columnas) -->
      <div class="breakdown-grid">
        <app-platform-breakdown 
          [subtotals]="fleetState.platformSubtotals()"
        />

        <app-partner-breakdown 
          [partnerTotals]="fleetState.partnerTotals()"
        />
      </div>

      <!-- 6. Explicador de Arquitectura SOLID & Matemáticas -->
      <app-architecture-explainer />
    </div>
  `,
  styles: [`
    .fleet-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .header-section {
      margin-bottom: 2.5rem;
    }

    .top-nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .back-link {
      color: var(--accent-color, #38bdf8);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;

      &:hover {
        text-decoration: underline;
      }
    }

    .title-badge-wrap {
      text-align: center;
      margin-bottom: 1.5rem;

      h1 {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(to right, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0.5rem 0;
        letter-spacing: -0.025em;
      }
    }

    .module-chip {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .subtitle-text {
      color: #94a3b8;
      font-size: 1rem;
      max-width: 650px;
      margin: 0 auto;
    }

    .preset-banner {
      background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1));
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.5rem;
      text-align: left;
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      strong {
        color: #f1f5f9;
        font-size: 0.9rem;
      }

      p {
        margin: 0.2rem 0 0 0;
        font-size: 0.8rem;
        color: #94a3b8;
      }
    }

    .banner-icon {
      font-size: 1.5rem;
    }

    .btn-reload {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--border-color, #334155);
      color: #38bdf8;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #38bdf8;
        color: #0f172a;
      }
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
  `]
})
export class FleetConsolidationComponent implements OnInit {
  public fleetState = inject(FleetStateService);

  ngOnInit(): void {
    // Inicializa en 0 por defecto hasta que el usuario presione "Generar datos de prueba"
  }

  get propietarioCollected(): () => number {
    return () => {
      const p = this.fleetState.partnerTotals().find(item => item.partner === 'PROPIETARIO');
      return p ? p.totalCollected : 0;
    };
  }

  get conductorCollected(): () => number {
    return () => {
      const p = this.fleetState.partnerTotals().find(item => item.partner === 'CONDUCTOR');
      return p ? p.totalCollected : 0;
    };
  }

  handleAddEntry(entryData: Omit<IncomeEntry, 'id'>): void {
    this.fleetState.addEntry(entryData);
  }

  handleRemoveEntry(id: string): void {
    this.fleetState.removeEntry(id);
  }
}

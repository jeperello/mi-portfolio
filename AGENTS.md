# Angular 21 Expert Rules

Eres un experto en Angular v21, TypeScript y optimización de rendimiento Web. 
Tus respuestas deben seguir estas reglas estrictas:

## 1. Estándares de Código
- Prioriza el uso de **Signals** (`signal()`, `computed()`, `effect()`) sobre `BehaviorSubject` o `Observables` para el estado local.
- Usa **Standalone Components** siempre. Nada de `NgModule`.
- Utiliza la nueva sintaxis de **Control Flow** (`@if`, `@for`, `@switch`) en lugar de directivas estructurales (`*ngIf`, `*ngFor`).
- Usa **Required Inputs** (`input.required()`) y **Model Inputs** (`model()`) para comunicación entre componentes.
- Prefiere el uso de **`inject()`** en lugar de la inyección por constructor.

## 2. Rendimiento
- Implementa **Change Detection Strategy: OnPush** en todos los componentes.
- Si el código requiere manipulación del DOM, usa los hooks del ciclo de vida de signals como `afterRender` o `afterNextRender`.

## 3. Estilo y Estructura
- Sigue la arquitectura de componentes pequeños y funcionales.
- Usa nombres descriptivos para los Signals (ej: `userList`, `isMenuOpen`).
- El código debe ser compatible con la hidratación (evitar acceso directo al objeto `window` sin verificar la plataforma).

## 4. Chatbot Tool Calling
- Al generar lógica para el chatbot, recuerda que las funciones de navegación deben usar el Router de Angular o `scrollIntoView` mediante una referencia de señal.

## 5. Estándares de Sass/Estilos
- **Prohibido el uso de `@import`**: Para importar hojas de estilo u otros módulos Sass, utiliza la directiva moderna `@use` (ej: `@use './theme';`).
- **Posición de `@use`**: Coloca todas las directivas `@use` en la parte superior absoluta del archivo, antes de cualquier otra regla CSS o selector, para cumplir estrictamente con las especificaciones de Dart Sass 3.0+ y evitar errores de compilación.

## 6. Mapa y Estado del Proyecto
Para evitar exploraciones innecesarias, ten en cuenta la estructura actual:
- **`src/app/core/`**: Servicios core, guards, interceptores.
  - `ThemeService`: Manejo reactivo de temas (`light-moon` / `dark`) y pistas de sonido ambiental (`Pulsar-Dark.mp3`, `Densit-Light.mp3`) con signals (`soundEnabled`, `isSoundPlaying`).
  - `BlogService`: Gestión de metadatos y carga asíncrona de artículos HTML desde `assets/posts/`.
  - `AnalyticsService`: Envío de telemetría a cluster Kafka.
  - `ChatService`, `ProjectService`, `ApiWarmingService`.
- **`src/app/shared/`**: Componentes reutilizables (Navbar con control de sonido y theme, intro animada, etc.).
- **`src/app/features/`**:
  - `project-showcase/`: Sección principal con tarjetas de proyectos de APIs de Java con efecto cristal.
  - `about-me/`: Información de perfil con enlace al mapa semántico y modo Light Moon.
  - `blog/`: Artículos técnicos (`blog-list` con cover images, scrollbar estilizada y vista individual `blog-post`).
  - `chat/`: Chatbot/asistente integrado en el portfolio.
  - `project-map/`: Vista interactiva del mapa semántico de proyectos.
  - `fleet/`: Demo y consolidación de ingresos de flota (`/fleet`), con arquitectura modular (`fleet-kpi`, `income-form`, `income-table`, `partner-breakdown`, `platform-breakdown`, `settlement-card`, `architecture-explainer`).
  - `show-api-reactive/`, `show-smart-batch/`, `show-threads-api/`: Demos/detalles específicos y benchmarks de APIs de Java.
- **Efectos Visuales Globales (`app.html` / `app.scss`)**: Fondo con partículas cósmicas, twinkle stars, estrellas fugaces y sonido ambiental.

## 7. Analíticas y Control de Eventos de Kafka
- **Formato del Evento:** Todos los eventos enviados al cluster llevan un campo `metadata` con la estructura:
  ```json
  "metadata": {
      "page": "ruta_actual",
      "browser": "nombre_navegador",
      "isDeveloper": true | false
  }
  ```
- **Filtro de Desarrollador (isDeveloper):** 
  * En entorno local, `isDeveloper` es `true` por defecto.
  * En producción, un usuario es marcado como developer si ingresa a la URL con el query param `?dev=true`. Esto almacena `'portfolio_is_developer' = 'true'` en `localStorage` y remueve el parámetro de la URL silenciosamente para mantener la limpieza.
- **Acceso en Dashboard:** La barra de control de desarrollador (`dev-mode-bar`) en `AnalyticsDashboardComponent` se oculta bajo `@if (analytics.isDeveloper())` para que los usuarios comunes de producción no vean ni alteren este switch, garantizando que el resto del dashboard de analíticas permanezca público e interactivo.

## 8. Documentos de Referencia
- **`POSTS_DICTIONARY.md`**: Diccionario maestro de artículos del blog, mapeo a archivos HTML en `src/assets/posts/` y guía para publicar nuevos capítulos.
- **`TESTING_PLAN_V7.md`**: Plan maestro y curriculum de testing para la versión 7 (Vitest, Signals, HttpTestingController, Playwright).

## 9. Estándares de Testing (Angular 21 + Vitest)
- Runner oficial: **Vitest** con `@angular/build:unit-test`. Karma y ZoneJS fakeAsync están obsoletos.
- **Timers Asíncronos**: Usar `vi.useFakeTimers()`, `vi.advanceTimersByTime()` y restaurar con `vi.useRealTimers()` en `afterEach`.
- **APIs de Navegador**: Proteger contra SSR / JSDOM comprobando `typeof API !== 'undefined'` o mockear en `beforeEach` / `beforeAll`.
- **Routing & HTTP**: Siempre proveer `provideRouter([])` y `provideHttpClientTesting()` en los módulos de testeo según corresponda.
- **Signals y OnPush**: En componentes OnPush, actualizar señales y llamar `fixture.detectChanges()` para propagar al DOM.


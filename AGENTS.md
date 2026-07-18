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
- **`src/app/shared/`**: Componentes reutilizables, directivas y pipes comunes.
- **`src/app/features/`**:
  - `project-showcase/`: Sección principal que muestra la lista de proyectos de APIs de Java.
  - `about-me/`: Información del perfil.
  - `blog/`: Artículos técnicos.
  - `chat/`: Chatbot/asistente integrado en el portfolio.
  - `project-map/`: Vista de relaciones/mapa de proyectos.
  - `show-api-reactive/`, `show-smart-batch/`, `show-threads-api/`: Demos/detalles específicos de APIs de Java.

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

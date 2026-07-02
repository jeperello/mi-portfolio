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


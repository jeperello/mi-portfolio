# UFO-GAME Documentation

## Resumen

UFO-GAME es un mini juego interactivo integrado en el portfolio con un platillo volador cósmico, HUD táctico y secuencia arcade de impactos, caída y reinicio.

Este comportamiento quedó implementado en los archivos:

- `src/app/shared/ufo/ufo.component.ts`
- `src/app/shared/ufo/ufo.component.html`
- `src/app/shared/ufo/ufo.component.scss`
- `src/app/shared/ufo/ufo.component.spec.ts`

## Comportamiento final

### 1) Estado inicial

Al arrancar, el componente entra en modo `TARGET READY`:

- el UFO aparece volando en una de las 3 trayectorias
- el contador del HUD muestra `0/3`
- el botón visible debajo del medidor dice `STOP`
- el estado de alarma y de caída están desactivados

### 2) Sistema de impactos

Cada clic sobre el UFO incrementa el contador de impactos:

- `1/3` → estado `SHIELD 66%`
- `2/3` → estado `SHIELD 33%`
- `3/3` → estado `CRITICAL DAMAGE!`

En los impactos 1 y 2, el UFO se alarma durante un breve período y muestra un mensaje cómico aleatorio. Luego vuelve a su vuelo normal.

### 3) Secuencia de caída completa

Cuando se alcanza el tercer impacto:

1. se activa la secuencia de crash
2. el HUD pasa a modo crítico
3. el UFO inicia su caída cósmica
4. tras ~300 ms aparece el marciano en paracaídas
5. después de ~4.6 s finaliza la caída del platillo
6. el marciano sigue descendiendo suavemente por ~11 s más
7. finalmente el componente entra en respawn
8. el contador se reinicia a `0/3` y el UFO vuelve a estar listo

### 4) Botón STOP / RESTART

Se agregó un botón debajo del medidor de vida:

- si el juego está activo, el botón dice `STOP`
- al presionarlo, el UFO desaparece y queda apagado
- el botón cambia a `RESTART`
- al presionar `RESTART`, el juego vuelve a su estado inicial con contador en `0/3`

Además, si el usuario ya alcanzó los `3/3` impactos, el botón aparece ya como `RESTART`, evitando el flujo de STOP en ese punto del juego.

## Estados principales del componente

El componente usa signals para manejar el estado reactivo:

- `trajectoryIndex`: trayectoria actual del platillo
- `hitCount`: contador de impactos
- `isAlarmed`: estado de alarma tras disparos
- `isBeamActive`: rayo tractor activo
- `isCrashing`: indicador de caída crítica
- `isRespawning`: estado de reparación / reinicio
- `showParatrooper`: visibilidad del marciano en paracaídas
- `isStopped`: estado detenido manualmente

## Archivos clave

### Componente lógico

- `src/app/shared/ufo/ufo.component.ts`

En este archivo se definen:

- las señales del juego
- la lógica de impacto
- la secuencia de crash
- la lógica de STOP / RESTART
- la limpieza de timers para evitar estados colgados

### Plantilla

- `src/app/shared/ufo/ufo.component.html`

Aquí se renderizan:

- HUD táctico con contador y estado
- botón de control
- platillo volador
- marciano en paracaídas
- mensajes cómicos del juego

### Estilos

- `src/app/shared/ufo/ufo.component.scss`

Se encarga de:

- HUD con estilo arcade
- trayectorias de vuelo
- animaciones de alarma y caída
- glow, scanline y estéticas visuales del juego

## Pruebas

La lógica del componente queda cubierta por una suite específica en:

- `src/app/shared/ufo/ufo.component.spec.ts`

Se validan escenarios como:

- inicialización
- incremento de impactos
- cambio de estado del HUD
- secuencia de crash y respawn
- alternancia entre STOP y RESTART

## Verificación actual

Se ejecutó esta prueba del componente:

```bash
npx ng test --watch=false --include src/app/shared/ufo/ufo.component.spec.ts
```

Resultado verificado:

- `1` archivo de test pasado
- `6` tests pasados
- `0` fallas

## Nota visual recomendada para el próximo paso

Si en un futuro se quiere pulir más el detalle visual, el siguiente nivel ideal sería:

- hacer que el botón `STOP`/`RESTART` se vea más arcade
- añadir un efecto de apagado del UFO
- reforzar la diferencia visual entre `STOP` y `RESTART`
- animar más claramente la desaparición / reapertura del platillo

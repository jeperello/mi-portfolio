# 📖 Diccionario y Guía de Posts del Blog

Este archivo es tu guía rápida de referencia personal. Sirve para saber instantáneamente qué archivo HTML editar según el post o capítulo que quieras escribir, cómo está configurado en el servicio y qué pasos seguir para publicarlo.

---

## 🗂️ Tabla Maestra de Posts

| ID | Archivo HTML | Título / Capítulo | Subtítulo / Tema | Estado Actual |
| :---: | :--- | :--- | :--- | :---: |
| **`1`** | [`post-1-chatbot.html`](file:///src/assets/posts/post-1-chatbot.html) | **Chatbot: El Detrás de Escena** | ¿Adiós a Chatie en Node.js? Spring AI | 🟢 Publicado |
| **`2`** | [`post-2-spring-mvc.html`](file:///src/assets/posts/post-2-spring-mvc.html) | **Spring MVC vs WebFlux vs Virtual Threads** | Comparativa de paradigmas de concurrencia | 🟢 Publicado |
| **`3`** | [`post-3-fleet-intro.html`](file:///src/assets/posts/post-3-fleet-intro.html) | **Construyendo Fleet-FiftyFifty (Hub)** | Portada principal y bienvenida a la saga | 🟢 Publicado (`Hub`) |
| **`4`** | [`post-4-fleet-cap-1.html`](file:///src/assets/posts/post-4-fleet-cap-1.html) | **Capítulo 1 — Del problema a la idea** | Origen real del proyecto y problema de negocio | 🟢 Publicado (`Done`) |
| **`5`** | [`post-5-fleet-cap-2.html`](file:///src/assets/posts/post-5-fleet-cap-2.html) | **Capítulo 2 — La importancia del análisis** | Caso de Estudio y análisis previo al código | 🟢 Publicado (`Done`) |
| **`6`** | [`post-6-fleet-cap-3.html`](file:///src/assets/posts/post-6-fleet-cap-3.html) | **Capítulo 3 — Entendiendo el dominio (DDD)** | Lenguaje Ubicuo y roles de la flota | 🟢 Publicado (`Done`) |
| **`7`** | [`post-7-fleet-cap-4.html`](file:///src/assets/posts/post-7-fleet-cap-4.html) | **Capítulo 4 — ¿Por qué elegí Arq. Hexagonal?** | Las 5 capas y desacople del core | 🟢 Publicado (`Done / Último`) |
| **`8`** | [`post-8-fleet-cap-5.html`](file:///src/assets/posts/post-8-fleet-cap-5.html) | **Capítulo 5 — Mi primera experiencia con TDD** | Desarrollo guiado por pruebas en el dominio | ⚡ En progreso (`En proceso`) |
| **`9`** | [`post-9-fleet-cap-6.html`](file:///src/assets/posts/post-9-fleet-cap-6.html) | **Capítulo 6 — Despliegue del backend** | Infraestructura, contenedores y despliegue | 📝 Borrador (`Próximo`) |
| **`10`** | [`post-10-fleet-cap-7.html`](file:///src/assets/posts/post-10-fleet-cap-7.html) | **Capítulo 7 — Implementando desde Angular** | Conexión del frontend reactivo con el backend | 📝 Borrador (`Próximo`) |

---

## 📁 Ubicaciones Clave del Código

- **Contenido HTML de los artículos:**  
  `src/assets/posts/`
- **Metadatos, fechas y lista de capítulos:**  
  [`src/app/core/services/blog.service.ts`](file:///src/app/core/services/blog.service.ts)
- **Componentes visuales del blog:**  
  - Listado de tarjetas: `src/app/features/blog/blog-list.component.ts` (.html / .scss)
  - Vista del artículo individual: `src/app/features/blog/blog-post.component.ts` (.html / .scss)

---

## 🚀 Cheat-Sheet: Cómo Publicar o Activar un Capítulo

Cuando termines de redactar un post en su archivo HTML (por ejemplo, el **Capítulo 5** en `post-8-fleet-cap-5.html`):

1. **Abrí [`blog.service.ts`](file:///src/app/core/services/blog.service.ts)**.
2. **En el objeto del post (ejemplo `id: '8'`):**
   - Cambiá `date: 'Próximamente'` por la fecha real (ej: `'15 de agosto de 2026'`).
   - Cambiá `status: 'Próximo'` a `'Completado'` o `'En progreso'`.
3. **En el índice de capítulos de Fleet-FiftyFifty (dentro de `id: '3'`):**
   - Agregale el `postId: '8'`.
   - Cambiá su estado de `'Próximo'` a `'Done'` (o `'Actual'` si estás trabajando en él).
4. **¡Listo!** El sistema habilitará automáticamente el link clickeable y cargará el HTML en cuanto alguien ingrese.

---

> 💡 **Tip:** Si querés crear un nuevo post independiente que aparezca como tarjeta principal en el listado del blog, solo tenés que asegurarte de que `showCard` no esté en `false` (por defecto es visible).

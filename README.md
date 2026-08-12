# Frontend Productos

Aplicación SPA desarrollada en Angular para catálogo y compra de dispositivos móviles.

## Requisitos previos
* Node.js (v20 o superior)
* npm

## Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Arrancar servidor de desarrollo (puerto 4200)
```bash
npm start
```
Abrir en el navegador: `http://localhost:4200`

---

## Scripts disponibles

* `npm start`: Inicia el servidor de desarrollo en local (`ng serve`).
* `npm run build`: Compila la aplicación para producción (`ng build`).
* `npm test`: Ejecuta la suite de pruebas unitarias con Vitest (`ng test --watch=false`).
* `npm run lint`: Comprueba el formateo del código fuente.

---

## Arquitectura y Decisiones Técnicas

* **Estructura por tipo de archivo**: Organización limpia y desacoplada en `models/`, `services/` y `components/`.
* **Angular Moderno**: Uso de *Standalone Components*, *Control Flow* (`@if`, `@for`, `@empty`) y *Signals* para la gestión reactiva del estado sin fugas de memoria.
* **Caché en Cliente (1 hora)**: Implementación de almacenamiento en `localStorage` con control de expiración (TTL de 60 minutos) tanto para el listado del catálogo como para las fichas individuales de producto.
* **Buscador en tiempo real**: Filtrado reactivo en memoria por marca y modelo mediante `computed()` Signals en 0 ms.
* **Ficha de producto y preselección**: Layout a 2 columnas con preselección automática de variantes cuando solo existe una opción disponible.

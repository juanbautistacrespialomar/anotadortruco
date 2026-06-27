# Truco 🎴

Anotador de truco con el clásico **cartón de tiza**: palitos que se juntan de a 5 (cuatro lados y la diagonal), dividido en **Nosotros** y **Ellos**, con **malas** y **buenas**. Elegís si jugás **a 30 o a 40** antes de empezar. Funciona **offline** y se instala en el celular como una app.

---

## Cómo usarlo

1. Al abrir, elegí si juegan **a 30** o **a 40**.
2. Tocá **+** para sumar un punto a cada lado, **−** para bajar.
3. Los puntos se anotan como palitos de a 5; la primera mitad son las **malas** y la segunda las **buenas**.
4. Cuando un lado llega al tanto, aparece el cartel de **ganador** y se suma un chico.
5. **Reiniciar** (abajo de todo) borra puntos y chicos, con confirmación previa.

---

## Estructura del repositorio

```
.
├── index.html          ← la app entera (HTML + CSS + JS, sin dependencias)
├── manifest.json       ← config de la PWA (nombre, íconos, colores)
├── service-worker.js   ← cache para que funcione offline
├── Logo.png            ← el logo (lo subís vos)
└── README.md
```

> ⚠️ **Importante con el logo:** el archivo tiene que llamarse exactamente **`Logo.png`** (con L mayúscula). GitHub Pages corre sobre Linux y distingue mayúsculas de minúsculas, así que `logo.png` o `Logo.PNG` no van a coincidir con lo que espera el `index.html` y el `manifest.json`. Para que se vea bien como ícono de app conviene que sea cuadrado (idealmente 512×512 px).

---

## Publicar en GitHub Pages

1. Creá un repositorio nuevo (por ejemplo `truco`).
2. Subí estos archivos a la raíz del repo, incluido tu `Logo.png`.
3. En el repo, andá a **Settings → Pages**.
4. En **Source**, elegí **Deploy from a branch**.
5. Branch: **main** · carpeta: **/ (root)**. Guardá.
6. En un minuto te queda publicada en:
   `https://TU_USUARIO.github.io/truco/`

Como todas las rutas son relativas (`./`), funciona igual si la servís desde la raíz del dominio o desde una subcarpeta.

---

## Offline y actualizaciones

- **Offline:** la primera vez que la abrís *con* internet, el service worker guarda la app. Después funciona sin conexión.
- **Instalable:** en el celular, desde el menú del navegador → *Agregar a la pantalla de inicio*. Queda como una app a pantalla completa.
- **No se rompe al actualizar:** el HTML usa estrategia *network-first*. Si hay internet, siempre carga la última versión que subiste a GitHub.
- **No se pierden los datos:** los puntos y chicos se guardan en `localStorage`, que es independiente del cache. Actualizar la app **no borra** tu partido.

### Cuando subas cambios

El HTML se actualiza solo (al estar online). Si tocaste el `manifest.json`, el `Logo.png` u otro asset y querés forzar que todos los dispositivos refresquen el cache, abrí `service-worker.js` y subí el número de versión:

```js
const CACHE = "truco-v1"; // → "truco-v2"
```

Eso hace que el service worker nuevo borre los caches viejos al activarse. (Tus datos en `localStorage` siguen intactos: nunca cambies la constante `KEY` del `index.html`.)

---

## Tecnología

HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin dependencias externas (salvo las fuentes de Google, que el service worker también cachea para el modo offline). Los palitos se dibujan con SVG y un filtro de turbulencia que les da textura de tiza.

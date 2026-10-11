# KakoJuegos — Evaluación Final Transversal (EFT)

**Asignatura:** Desarrollo Frontend I (PFY2201) — Duoc UC
**Alumno:** Joaquín Gómez Flores
**Actividad:** Evaluación Final Transversal, Semana 9 (forma A)

- Repositorio: https://github.com/KakoGF/EFT-Frontend
- Sitio publicado (gh-pages): https://kakogf.github.io/EFT-Frontend/

---

## ¿De qué se trata?

KakoJuegos es la tienda online de videojuegos para PC que fui armando durante el semestre. Partió en la Semana 1 como un HTML básico. Después le agregué Bootstrap 5 y JavaScript, y en las Semanas 7 y 8 la pasé a React.

Para la EFT junté todo en un solo sitio, que tiene:

- Una **página principal** con los juegos en **tarjetas** (imagen, nombre, precio y descripción).
- Una **barra de navegación** para moverse entre las secciones Inicio, Catálogo, Administrar y Contacto.
- **Botones para filtrar** los juegos por categoría y un buscador por nombre.
- Un **formulario de contacto** (nombre, email y mensaje) que valida los datos antes de enviarlos.
- Un **panel de administración** para **agregar y eliminar juegos** de la lista (usa el estado de React).
- Además se mantienen el carrito de compras, el carrusel de destacados y el modal de detalle de las semanas anteriores.

### Lo nuevo en la EFT

1. **Formulario de contacto con validación** (componente `FormularioContacto`).
2. **Filtro por categoría con botones** (componente `FiltroCategorias`), que muestra cuántos juegos hay en cada categoría.
3. **Navbar por secciones:** Inicio, Catálogo, Administrar y Contacto.
4. **Funciones de JavaScript puro** separadas de React: `utils/filtros.js` y `utils/validaciones.js`.
5. **Flexbox y CSS Grid propios** en `kakojuegos.css` (barra de filtros y sección de contacto).
6. **Feedback de la Semana 8, parte 1:** el panel admin ahora valida **campo por campo** antes de publicar un juego. Revisa nombres repetidos, que la URL de la imagen sea válida y que el precio oferta no supere al normal. También le agregué el campo **descripción**.
7. **Feedback de la Semana 8, parte 2:** los **filtros quedan guardados en la URL**. Por ejemplo, `?categoria=RPG&q=baldur`. Si se recarga la página o se comparte el link, se abre con el mismo filtro.

---

## Tecnologías usadas

| Tecnología | Para qué la usé |
|---|---|
| HTML5 | Estructura con etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) |
| CSS3 | Estilos propios, Flexbox y CSS Grid (`src/styles/kakojuegos.css`) |
| Bootstrap 5.3 | Navbar, cards, carrusel, formularios, alertas y sistema de grillas responsivo |
| JavaScript | Objeto con los datos de los juegos, filtros y validaciones |
| React 19 + Vite | Componentes, `useState`, `useEffect` y props |
| gh-pages | Publicar el sitio en GitHub Pages |

---

## Instalación

### Requisitos

- **Node.js** versión 20 o superior (se descarga desde https://nodejs.org). Para revisar si está instalado, se escribe `node -v` en la terminal.
- **Git**, para clonar el repositorio.
- Un editor como **VS Code**.

### Pasos

Todos los comandos van en la terminal **CMD** de VS Code.

1. Clonar el repositorio y entrar a la carpeta:

   ```
   git clone https://github.com/KakoGF/EFT-Frontend.git
   cd EFT-Frontend
   ```

   Si se usa el `.zip` de la entrega, basta con descomprimirlo y abrir la carpeta en VS Code.

2. Instalar las dependencias (esto crea la carpeta `node_modules`):

   ```
   npm install
   ```

3. Levantar el servidor de desarrollo:

   ```
   npm run dev
   ```

4. Abrir en el navegador la dirección que aparece en la terminal:

   ```
   http://localhost:5173/EFT-Frontend/
   ```

   Para detener el servidor se presiona `Ctrl + C`.

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run build` | Arma la versión final del sitio en la carpeta `dist` |
| `npm run preview` | Muestra la versión de `dist` como quedaría publicada |
| `npm run lint` | Revisa el código con oxlint |
| `npm run deploy` | Hace el build y lo sube a la rama `gh-pages` |

### Publicar en GitHub Pages

```
npm run deploy
```

Después, en GitHub: **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`**.

Ojo: en `vite.config.js` la opción `base: '/EFT-Frontend/'` tiene que llevar el mismo nombre del repositorio. Si no coincide, el sitio publicado no encuentra sus archivos.

---

## Cómo usar el sitio

1. **Ver los juegos:** en la página principal aparecen las tarjetas con imagen, nombre, plataforma, descripción y precio.
2. **Filtrar por categoría:** con los botones *Todos / Acción / RPG / Mundo abierto* que están sobre el catálogo. Cada botón muestra cuántos juegos hay en esa categoría.
3. **Buscar por nombre:** se escribe en el buscador de la navbar y el catálogo se filtra mientras uno escribe (no importan las mayúsculas ni las tildes). Si se aprieta "Buscar" con el campo vacío, sale un aviso.
4. **Compartir un filtro:** al filtrar, la URL cambia (por ejemplo, `?categoria=RPG`). Ese link se puede copiar y abre el catálogo ya filtrado.
5. **Ver el detalle de un juego:** el botón "Ver detalles" abre un modal, que se cierra con la X, con "Cerrar", con la tecla Escape o haciendo clic fuera.
6. **Comprar:** "Agregar al carrito" suma el juego y el botón cambia a "En el carrito (n)". En el carrito se pueden sumar o restar unidades, eliminar juegos o vaciarlo. El carrito no se pierde al recargar la página.
7. **Administrar el catálogo:** en la sección *Administrar* se presiona "Mostrar panel admin".
   - Para **agregar** un juego se llena el formulario. Si algún dato está mal, el campo se marca en rojo con su explicación y el juego no se publica.
   - Para **eliminar** un juego se usa el botón "Eliminar" de la lista.
8. **Contactarnos:** en la sección *Contacto* se llenan nombre, email y mensaje (el juego por el que se consulta es opcional). Si falta algo o está mal escrito, el campo se marca en rojo con el error. Si todo está bien, aparece "¡Mensaje enviado!" y el formulario queda limpio. El envío es simulado, porque el proyecto no tiene servidor.

---

## Estructura de carpetas

```
EFT-Frontend/
├── index.html                 Página base: React dibuja todo dentro de <div id="root">
├── package.json               Dependencias y comandos (dev, build, deploy)
├── vite.config.js             Configuración de Vite (base para GitHub Pages)
├── public/
│   ├── productos.json         Datos de los 6 videojuegos
│   └── img/                   Portadas e imagen por defecto
└── src/
    ├── main.jsx               Monta <App /> e importa Bootstrap y los estilos
    ├── App.jsx                Componente principal: guarda el estado y lo reparte por props
    ├── components/
    │   ├── Navbar.jsx              Barra de navegación por secciones
    │   ├── Buscador.jsx            Formulario de búsqueda por nombre
    │   ├── Encabezado.jsx          Título de la tienda (<header>)
    │   ├── Carrusel.jsx            Juegos destacados
    │   ├── FiltroCategorias.jsx    NUEVO: botones para filtrar por categoría
    │   ├── ProductList.jsx         Lista de juegos (cargando / error / sin resultados / tarjetas)
    │   ├── ProductCard.jsx         Tarjeta de un juego
    │   ├── PrecioProducto.jsx      Precio normal tachado + precio oferta
    │   ├── ModalDetalle.jsx        Detalle del juego
    │   ├── ShoppingCart.jsx        Panel del carrito
    │   ├── CartItem.jsx            Fila del carrito
    │   ├── CartTotal.jsx           Totales y ahorro
    │   ├── PanelAdmin.jsx          Panel para agregar y eliminar juegos
    │   ├── ProductoForm.jsx        Formulario del panel admin (validación por campo)
    │   ├── FormularioContacto.jsx  NUEVO: formulario de contacto con validación
    │   ├── CampoFormulario.jsx     NUEVO: campo reutilizable con su mensaje de error
    │   ├── Mensaje.jsx             Alerta reutilizable
    │   └── Footer.jsx              Pie de página
    ├── hooks/
    │   └── useCarrito.js      Lógica del carrito + guardado en localStorage
    ├── utils/
    │   ├── formato.js         Precios, rutas e imágenes
    │   ├── filtros.js         NUEVO: filtrar, contar por categoría y filtros en la URL
    │   └── validaciones.js    NUEVO: validar el formulario de contacto y el del panel admin
    └── styles/
        └── kakojuegos.css     Estilos propios (Flexbox, CSS Grid, colores)
```
---

## Consideraciones

- El formulario de contacto **simula** el envío, porque el proyecto es solo frontend y no tiene un servidor que reciba los mensajes.
- Los juegos agregados desde el panel admin **no se guardan al recargar**, porque el catálogo siempre se vuelve a leer desde `productos.json`. Lo que sí se guarda es el carrito (en `localStorage`) y los filtros (en la URL).
- Al eliminar un juego del catálogo, también sale del carrito.

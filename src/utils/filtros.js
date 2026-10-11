import { normalizarTexto } from './formato.js'

/* ==========================================================
   Funciones de filtrado (JavaScript puro, sin React).
   Reciben datos y devuelven un resultado nuevo, sin modificar
   el arreglo original. App las usa en cada renderizado.
   ========================================================== */

// Categorías de la tienda. "Todos" no es una categoría real: significa "sin filtro".
export const CATEGORIAS = ['Todos', 'Acción', 'RPG', 'Mundo abierto']

/**
 * Devuelve solo los videojuegos que coinciden con la categoría
 * y con el texto buscado (sin importar mayúsculas ni tildes).
 */
export function filtrarVideojuegos(videojuegos, categoria, busqueda) {
  const textoBuscado = normalizarTexto(busqueda)

  return videojuegos.filter((juego) => {
    const coincideCategoria = categoria === 'Todos' || juego.categoria === categoria
    const coincideTexto = normalizarTexto(juego.nombre).includes(textoBuscado)
    return coincideCategoria && coincideTexto
  })
}

/**
 * Cuenta cuántos juegos hay en cada categoría.
 * Ejemplo de resultado: { Todos: 6, Acción: 2, RPG: 2, 'Mundo abierto': 2 }
 */
export function contarPorCategoria(videojuegos, categorias) {
  const conteo = {}
  categorias.forEach((categoria) => {
    conteo[categoria] =
      categoria === 'Todos'
        ? videojuegos.length
        : videojuegos.filter((juego) => juego.categoria === categoria).length
  })
  return conteo
}

/* ==========================================================
   Filtros guardados en la URL (sugerencia del feedback S8)
   Ejemplo: .../EFT-Frontend/?categoria=RPG&q=baldur
   Así, al recargar o compartir el link, el catálogo se abre
   con el mismo filtro. Se usa URLSearchParams, que viene
   incluido en el navegador.
   ========================================================== */

/**
 * Lee la categoría y la búsqueda desde la dirección actual.
 * Si la categoría de la URL no existe, se usa "Todos".
 */
export function leerFiltrosDeUrl() {
  const parametros = new URLSearchParams(window.location.search)
  const categoria = parametros.get('categoria')

  return {
    categoria: CATEGORIAS.includes(categoria) ? categoria : 'Todos',
    busqueda: parametros.get('q') ?? '',
  }
}

/**
 * Escribe los filtros en la URL sin recargar la página.
 * history.replaceState cambia la dirección sin crear una entrada
 * nueva en el historial (el botón "atrás" no se llena de filtros).
 * Los filtros vacíos no se escriben, para que la URL quede limpia.
 */
export function guardarFiltrosEnUrl(categoria, busqueda) {
  const parametros = new URLSearchParams()
  if (categoria !== 'Todos') parametros.set('categoria', categoria)
  if (busqueda.trim() !== '') parametros.set('q', busqueda.trim())

  const consulta = parametros.toString()
  const nuevaUrl = `${window.location.pathname}${consulta ? `?${consulta}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', nuevaUrl)
}

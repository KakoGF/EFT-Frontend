/* ==========================================================
   FiltroCategorias: botones para filtrar el catálogo.
   No guarda estado propio: la categoría elegida vive en App.
   Al hacer clic, el botón avisa a App con onCambiarCategoria,
   App actualiza su estado y ProductList se vuelve a dibujar
   solo con los juegos de esa categoría.

   Props:
     categorias          arreglo con los nombres de las categorías
     categoriaActual     categoría seleccionada (se marca en amarillo)
     conteo              objeto con la cantidad de juegos por categoría
     onCambiarCategoria  función de App que cambia la categoría
   ========================================================== */
function FiltroCategorias({ categorias, categoriaActual, conteo, onCambiarCategoria }) {
  return (
    <div className="filtro-categorias mb-4" role="group" aria-label="Filtrar juegos por categoría">
      <span className="small text-body-secondary">Filtrar por categoría:</span>

      {categorias.map((categoria) => {
        const activa = categoria === categoriaActual
        return (
          // Evento onClick: cambia la categoría en el estado de App
          <button
            key={categoria}
            type="button"
            className={`btn btn-sm ${activa ? 'btn-warning' : 'btn-outline-warning'}`}
            aria-pressed={activa}
            onClick={() => onCambiarCategoria(categoria)}
          >
            {categoria}{' '}
            <span className={`badge ${activa ? 'text-bg-dark' : 'text-bg-secondary'}`}>
              {conteo[categoria] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default FiltroCategorias

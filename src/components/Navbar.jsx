import { useRef } from 'react'
import { Collapse } from 'bootstrap'
import Buscador from './Buscador.jsx'

// Secciones del sitio. Los enlaces se dibujan con .map():
// agregar una sección nueva es sumar un objeto a este arreglo.
const SECCIONES = [
  { nombre: 'Inicio', destino: '#inicio' },
  { nombre: 'Catálogo', destino: '#catalogo' },
  { nombre: 'Administrar', destino: '#admin' },
  { nombre: 'Contacto', destino: '#contacto' },
]

/* ==========================================================
   Navbar: barra de navegación responsiva de Bootstrap.
   - Se colapsa en menú hamburguesa bajo 992px (navbar-expand-lg).
   - Lleva a las secciones del sitio: Inicio, Catálogo,
     Administrar y Contacto.
   - Incluye el buscador y el contador del carrito.
   Las categorías ya no están aquí: ahora tienen su propio
   componente (FiltroCategorias) sobre el catálogo.

   Props:
     busqueda           texto actual del buscador
     onCambiarBusqueda  función que avisa a App el nuevo texto
     onEnviarBusqueda   función que avisa a App que se envió el formulario
     totalUnidades      cantidad de productos en el carrito
   ========================================================== */
function Navbar({ busqueda, onCambiarBusqueda, onEnviarBusqueda, totalUnidades }) {
  // useRef guarda una referencia al menú colapsable sin provocar re-renderizados.
  const menuRef = useRef(null)

  /**
   * En móvil, cierra el menú hamburguesa después de elegir una opción,
   * para que el usuario vea la sección sin tener que cerrarlo a mano.
   */
  function cerrarMenuMovil() {
    if (menuRef.current && menuRef.current.classList.contains('show')) {
      Collapse.getOrCreateInstance(menuRef.current).hide()
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top border-bottom border-danger">
      <div className="container">
        <a className="navbar-brand fw-bold text-danger" href="#inicio">
          KakoJuegos
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarPrincipal"
          aria-controls="navbarPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú de navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarPrincipal" ref={menuRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {SECCIONES.map((seccion) => (
              <li className="nav-item" key={seccion.destino}>
                <a className="nav-link" href={seccion.destino} onClick={cerrarMenuMovil}>
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>

          <Buscador
            busqueda={busqueda}
            onCambiarBusqueda={onCambiarBusqueda}
            onBuscar={(texto) => {
              onEnviarBusqueda(texto)
              cerrarMenuMovil()
            }}
          />

          <a
            href="#carrito"
            className="btn btn-outline-light btn-sm ms-lg-3 mt-2 mt-lg-0"
            onClick={cerrarMenuMovil}
          >
            Carrito{' '}
            <span className="badge text-bg-danger" aria-label={`${totalUnidades} productos en el carrito`}>
              {totalUnidades}
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

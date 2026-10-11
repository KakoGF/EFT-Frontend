import { useEffect, useState } from 'react'

import Navbar from './components/Navbar.jsx'
import Encabezado from './components/Encabezado.jsx'
import Carrusel from './components/Carrusel.jsx'
import FiltroCategorias from './components/FiltroCategorias.jsx'
import ProductList from './components/ProductList.jsx'
import ShoppingCart from './components/ShoppingCart.jsx'
import PanelAdmin from './components/PanelAdmin.jsx'
import FormularioContacto from './components/FormularioContacto.jsx'
import ModalDetalle from './components/ModalDetalle.jsx'
import Footer from './components/Footer.jsx'
import { useCarrito } from './hooks/useCarrito.js'
import { rutaPublica } from './utils/formato.js'
import {
  CATEGORIAS,
  contarPorCategoria,
  filtrarVideojuegos,
  guardarFiltrosEnUrl,
  leerFiltrosDeUrl,
} from './utils/filtros.js'

/* ==========================================================
   App: componente principal.
   Guarda el estado compartido (catálogo, filtros, carrito y
   producto abierto en el modal) y lo reparte a los componentes
   hijos mediante props. Los hijos avisan de los cambios
   llamando a las funciones que reciben por props.
   ========================================================== */
function App() {
  // ----- Estado del catálogo -----
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Los tres juegos que se destacan en el carrusel (se eligen al cargar el JSON)
  const [destacados, setDestacados] = useState([])

  // ----- Estado de los filtros -----
  // Parten con lo que venga en la URL (?categoria=RPG&q=baldur).
  // Se pasa una función para que la URL se lea solo la primera vez.
  const [categoriaActual, setCategoriaActual] = useState(() => leerFiltrosDeUrl().categoria)
  const [busqueda, setBusqueda] = useState(() => leerFiltrosDeUrl().busqueda)
  const [avisoBusqueda, setAvisoBusqueda] = useState('')

  // ----- Producto que se muestra en el modal (null = modal cerrado) -----
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  // ----- Carrito (useState + useEffect dentro del hook personalizado useCarrito) -----
  const carrito = useCarrito()

  /* useEffect con arreglo de dependencias vacío [ ]:
     se ejecuta una sola vez, cuando el componente aparece en pantalla.
     Carga el catálogo desde public/productos.json con la Fetch API
     y guarda el resultado en el estado "productos". */
  useEffect(() => {
    fetch(rutaPublica('productos.json'))
      .then((respuesta) => {
        // fetch no rechaza la promesa ante un 404 o 500,
        // por eso se revisa respuesta.ok y se lanza el error a mano.
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió con el estado ${respuesta.status}`)
        }
        return respuesta.json()
      })
      .then((datos) => {
        setProductos(datos)
        setDestacados(datos.slice(0, 3))
      })
      .catch((errorCarga) => {
        console.error('Error al cargar el catálogo:', errorCarga)
        setError('No pudimos cargar el catálogo en este momento. Revisa tu conexión e inténtalo nuevamente.')
      })
      .finally(() => setCargando(false))
  }, [])

  /* useEffect con dependencias [categoriaActual, busqueda]:
     cada vez que cambia un filtro se escribe en la URL
     (sugerencia del feedback S8). */
  useEffect(() => {
    guardarFiltrosEnUrl(categoriaActual, busqueda)
  }, [categoriaActual, busqueda])

  /* ==================== Catálogo (panel admin) ==================== */

  // Agrega al catálogo el juego que llega desde el formulario del panel admin.
  function agregarProducto(nuevoProducto) {
    setProductos([...productos, nuevoProducto])
  }

  // Elimina un juego del catálogo. Si estaba en el carrito, también sale de ahí.
  function eliminarProducto(idProducto) {
    setProductos(productos.filter((producto) => producto.id !== idProducto))
    carrito.eliminarDelCarrito(idProducto)
  }

  /* ==================== Filtros ==================== */

  // Lista visible y conteo por categoría: se calculan en cada renderizado
  // con funciones de JavaScript puro (utils/filtros.js).
  // No se guardan en el estado porque salen de "productos" y de los filtros.
  const productosVisibles = filtrarVideojuegos(productos, categoriaActual, busqueda)
  const conteoCategorias = contarPorCategoria(productos, CATEGORIAS)

  function limpiarFiltros() {
    setCategoriaActual('Todos')
    setBusqueda('')
    setAvisoBusqueda('')
  }

  // Cada vez que el usuario escribe se actualiza la búsqueda y se borra el aviso.
  function cambiarBusqueda(texto) {
    setBusqueda(texto)
    setAvisoBusqueda('')
  }

  // Al enviar el formulario vacío se avisa al usuario (se mantiene el catálogo completo).
  function enviarBusqueda(texto) {
    setAvisoBusqueda(texto.trim() === '' ? 'Escribe el nombre de un juego para buscarlo.' : '')
  }

  function cerrarModal() {
    setProductoSeleccionado(null)
  }

  return (
    <>
      <Navbar
        busqueda={busqueda}
        onCambiarBusqueda={cambiarBusqueda}
        onEnviarBusqueda={enviarBusqueda}
        totalUnidades={carrito.totalUnidades}
      />

      <Encabezado />

      <main>
        <Carrusel productos={destacados} />

        <div className="container my-5">
          <div className="row g-4">
            <section className="col-12 col-lg-8" id="catalogo" aria-labelledby="titulo-catalogo">
              <ProductList
                productos={productosVisibles}
                cargando={cargando}
                error={error}
                categoriaActual={categoriaActual}
                busqueda={busqueda}
                avisoBusqueda={avisoBusqueda}
                onAgregar={carrito.agregarAlCarrito}
                onVerDetalle={setProductoSeleccionado}
                onLimpiarFiltros={limpiarFiltros}
                cantidadEnCarrito={carrito.cantidadEnCarrito}
              >
                {/* Los botones de filtro solo tienen sentido cuando el catálogo cargó */}
                {!cargando && !error && (
                  <FiltroCategorias
                    categorias={CATEGORIAS}
                    categoriaActual={categoriaActual}
                    conteo={conteoCategorias}
                    onCambiarCategoria={setCategoriaActual}
                  />
                )}
              </ProductList>
            </section>

            <aside className="col-12 col-lg-4" id="carrito" aria-label="Carrito de compras">
              <ShoppingCart
                items={carrito.carrito}
                totalUnidades={carrito.totalUnidades}
                totalPagar={carrito.totalPagar}
                totalNormal={carrito.totalNormal}
                ahorro={carrito.ahorro}
                onAgregar={carrito.agregarAlCarrito}
                onQuitarUnidad={carrito.quitarUnidad}
                onEliminar={carrito.eliminarDelCarrito}
                onVaciar={carrito.vaciarCarrito}
              />
            </aside>
          </div>
        </div>

        {/* El panel admin solo se muestra cuando terminó la carga sin errores */}
        {!cargando && !error && (
          <PanelAdmin
            productos={productos}
            categorias={CATEGORIAS.filter((categoria) => categoria !== 'Todos')}
            onAgregarProducto={agregarProducto}
            onEliminarProducto={eliminarProducto}
          />
        )}

        <section id="contacto" className="container my-5" aria-labelledby="titulo-contacto">
          <h2 id="titulo-contacto" className="h3 text-warning mb-4">
            Contacto
          </h2>

          {/* CSS Grid propio (kakojuegos.css): una columna en móvil y dos desde tablet */}
          <div className="contacto-grid">
            <div className="contacto-info">
              <p className="text-body-secondary">
                ¿Tienes dudas sobre un juego, un pedido o quieres que traigamos un título nuevo?
                Completa el formulario y te respondemos a la brevedad.
              </p>
              <ul className="list-unstyled small mb-0">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contacto@kakojuegos.cl" className="link-warning">
                    contacto@kakojuegos.cl
                  </a>
                </li>
                <li>
                  <strong>Teléfono:</strong> +56 9 1234 5678
                </li>
                <li>
                  <strong>Horario:</strong> lunes a viernes, 10:00 a 19:00
                </li>
              </ul>
            </div>

            {/* Los productos llegan por props: un juego agregado en el panel admin
                aparece al tiro en la lista del formulario */}
            <FormularioContacto productos={productos} />
          </div>
        </section>
      </main>

      <Footer />

      {/* Renderizado condicional: el modal solo existe si hay un producto seleccionado */}
      {productoSeleccionado && (
        <ModalDetalle
          producto={productoSeleccionado}
          cantidadEnCarrito={carrito.cantidadEnCarrito(productoSeleccionado.id)}
          onAgregar={carrito.agregarAlCarrito}
          onCerrar={cerrarModal}
        />
      )}
    </>
  )
}

export default App

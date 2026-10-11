import { useState } from 'react'
import CampoFormulario from './CampoFormulario.jsx'
import Mensaje from './Mensaje.jsx'
import { tieneErrores, validarVideojuego } from '../utils/validaciones.js'

/* ==========================================================
   ProductoForm: formulario para agregar un juego al catálogo.
   Basado en el VideojuegoForm de la guía de la Semana 8:
   cada campo es un "input controlado" con su propio useState,
   y al enviar se llama a la función onAgregar que llega por props.

   EFT (sugerencia del feedback S8): ahora se valida campo por campo
   antes de publicar el juego. Cada campo muestra su propio error
   (con is-invalid de Bootstrap), se revisa que la URL de la imagen
   sea válida y que no exista otro juego con el mismo nombre.
   También se agregó el campo "Descripción", que se ve en la tarjeta.

   Props:
     categorias  categorías disponibles para el select
     catalogo    juegos actuales (para revisar nombres repetidos)
     onAgregar   función de App que agrega el juego al catálogo
   ========================================================== */
function ProductoForm({ categorias, catalogo, onAgregar }) {
  // Un estado por cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [precioOferta, setPrecioOferta] = useState('')
  const [stock, setStock] = useState('10')
  const [imagen, setImagen] = useState('')

  // true después del primer intento de envío: desde ahí los errores se ven en vivo
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  // Nombre del último juego agregado ('' = no mostrar el aviso de éxito)
  const [agregado, setAgregado] = useState('')

  const datos = { nombre, descripcion, precio, precioOferta, stock, imagen }
  const errores = intentoEnviar ? validarVideojuego(datos, catalogo) : {}

  /**
   * Evento onSubmit: evita que la página se recargue y valida los datos.
   * Solo si no hay errores se envía el juego a App y se limpia el formulario.
   */
  function manejarEnvio(evento) {
    evento.preventDefault()
    const erroresActuales = validarVideojuego(datos, catalogo)

    if (tieneErrores(erroresActuales)) {
      setIntentoEnviar(true)
      setAgregado('')
      return
    }

    const precioNumero = Number(precio)
    // El id nuevo es el id más alto del catálogo + 1, así nunca se repite
    const idNuevo = Math.max(0, ...catalogo.map((juego) => juego.id)) + 1

    onAgregar({
      id: idNuevo,
      nombre: nombre.trim(),
      categoria,
      precio: precioNumero,
      // Si no se escribe precio oferta, el juego queda a precio normal
      precioOferta: precioOferta === '' ? precioNumero : Number(precioOferta),
      imagen: imagen.trim(),
      plataforma: 'PC',
      stock: Number(stock),
      descripcion: descripcion.trim(),
      detalle: 'Juego agregado desde el panel de administración.',
    })

    setAgregado(nombre.trim())
    setIntentoEnviar(false)
    setNombre('')
    setCategoria(categorias[0])
    setDescripcion('')
    setPrecio('')
    setPrecioOferta('')
    setStock('10')
    setImagen('')
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <h3 className="h6 text-warning mb-3">Agregar juego</h3>

      {/* Renderizado condicional: solo aparece el mensaje que corresponda */}
      {agregado && <Mensaje tipo="success">&quot;{agregado}&quot; se agregó al catálogo.</Mensaje>}
      {tieneErrores(errores) && (
        <Mensaje tipo="danger">El juego no se publicó. Corrige los campos marcados en rojo.</Mensaje>
      )}

      <div className="row g-2">
        <div className="col-12">
          <CampoFormulario
            id="admin-nombre"
            etiqueta="Nombre *"
            valor={nombre}
            onCambiar={setNombre}
            error={errores.nombre}
            mostrarValido={intentoEnviar}
            placeholder="Ej: Hollow Knight"
          />
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="admin-categoria" className="form-label small mb-1">
            Categoría *
          </label>
          <select
            id="admin-categoria"
            className="form-select"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            {categorias.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-sm-6">
          <CampoFormulario
            id="admin-stock"
            etiqueta="Stock *"
            tipo="number"
            valor={stock}
            onCambiar={setStock}
            error={errores.stock}
            mostrarValido={intentoEnviar}
          />
        </div>

        <div className="col-12">
          <CampoFormulario
            id="admin-descripcion"
            etiqueta="Descripción *"
            multilinea
            valor={descripcion}
            onCambiar={setDescripcion}
            error={errores.descripcion}
            mostrarValido={intentoEnviar}
            placeholder="Texto corto que se verá en la tarjeta del juego"
            ayuda={`${descripcion.trim().length} de 200 caracteres (mínimo 10).`}
          />
        </div>

        <div className="col-12 col-sm-6">
          <CampoFormulario
            id="admin-precio"
            etiqueta="Precio normal *"
            tipo="number"
            valor={precio}
            onCambiar={setPrecio}
            error={errores.precio}
            mostrarValido={intentoEnviar}
            placeholder="Ej: 15990"
          />
        </div>

        <div className="col-12 col-sm-6">
          <CampoFormulario
            id="admin-oferta"
            etiqueta="Precio oferta (opcional)"
            tipo="number"
            valor={precioOferta}
            onCambiar={setPrecioOferta}
            error={errores.precioOferta}
            mostrarValido={intentoEnviar && precioOferta !== ''}
            placeholder="Ej: 9990"
          />
        </div>

        <div className="col-12">
          <CampoFormulario
            id="admin-imagen"
            etiqueta="URL de la imagen (opcional)"
            tipo="url"
            valor={imagen}
            onCambiar={setImagen}
            error={errores.imagen}
            mostrarValido={intentoEnviar && imagen !== ''}
            placeholder="https://..."
            ayuda="Si la dejas vacía, se muestra la imagen por defecto."
          />
        </div>
      </div>

      <button type="submit" className="btn btn-danger btn-sm w-100 mt-3">
        Agregar al catálogo
      </button>
    </form>
  )
}

export default ProductoForm

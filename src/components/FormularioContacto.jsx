import { useState } from 'react'
import CampoFormulario from './CampoFormulario.jsx'
import Mensaje from './Mensaje.jsx'
import { tieneErrores, validarContacto } from '../utils/validaciones.js'

/* ==========================================================
   FormularioContacto: formulario para escribirle a la tienda.
   - Cada campo es un "input controlado" con su propio useState.
   - Antes de enviar se validan los datos con validarContacto()
     (función de JavaScript puro en utils/validaciones.js).
   - Si hay errores, cada campo muestra su mensaje en rojo y el
     formulario NO se envía. Si todo está bien, se muestra un
     mensaje de éxito y el formulario queda limpio.

   No hay un servidor real: el envío se simula en el navegador.

   Props:
     productos  catálogo actual (llega desde App). Se usa para la
                lista "Juego por el que consultas", así un juego
                agregado en el panel admin aparece aquí al tiro.
   ========================================================== */
function FormularioContacto({ productos }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [juego, setJuego] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Pasa a true cuando el usuario intenta enviar. Desde ese momento
  // los errores se recalculan en cada tecla, así ve al tiro si ya lo corrigió.
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  // Nombre de quien envió el último mensaje ('' = no mostrar el aviso de éxito)
  const [enviadoPor, setEnviadoPor] = useState('')

  // Los errores no se guardan en el estado: se calculan a partir de los campos.
  const errores = intentoEnviar ? validarContacto({ nombre, email, mensaje }) : {}

  /**
   * Evento onSubmit: preventDefault evita que la página se recargue.
   * Si hay errores se muestran y se lleva el cursor al primer campo con error.
   */
  function manejarEnvio(evento) {
    evento.preventDefault()
    const erroresActuales = validarContacto({ nombre, email, mensaje })

    if (tieneErrores(erroresActuales)) {
      setIntentoEnviar(true)
      setEnviadoPor('')
      const primerCampo = Object.keys(erroresActuales)[0]
      document.getElementById(`contacto-${primerCampo}`)?.focus()
      return
    }

    setEnviadoPor(nombre.trim())
    setNombre('')
    setEmail('')
    setJuego('')
    setMensaje('')
    setIntentoEnviar(false)
  }

  return (
    <form className="card card-body formulario-contacto" onSubmit={manejarEnvio} noValidate>
      <h3 className="h5 text-warning mb-3">Escríbenos</h3>

      {/* Renderizado condicional: aviso de éxito o resumen de errores */}
      {enviadoPor && (
        <Mensaje tipo="success" titulo="¡Mensaje enviado!">
          Gracias, {enviadoPor}. Te responderemos a la brevedad.
        </Mensaje>
      )}
      {tieneErrores(errores) && (
        <Mensaje tipo="danger">Revisa los campos marcados en rojo antes de enviar.</Mensaje>
      )}

      <div className="grilla-campos">
        <CampoFormulario
          id="contacto-nombre"
          etiqueta="Nombre *"
          valor={nombre}
          onCambiar={setNombre}
          error={errores.nombre}
          mostrarValido={intentoEnviar}
          placeholder="Ej: Joaquín Gómez"
        />

        <CampoFormulario
          id="contacto-email"
          etiqueta="Email *"
          tipo="email"
          valor={email}
          onCambiar={setEmail}
          error={errores.email}
          mostrarValido={intentoEnviar}
          placeholder="nombre@correo.cl"
        />

        <div className="campo-formulario campo-ancho">
          <label htmlFor="contacto-juego" className="form-label small mb-1">
            Juego por el que consultas (opcional)
          </label>
          <select
            id="contacto-juego"
            className="form-select"
            value={juego}
            onChange={(evento) => setJuego(evento.target.value)}
          >
            <option value="">Consulta general</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.nombre}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-ancho">
          <CampoFormulario
            id="contacto-mensaje"
            etiqueta="Mensaje *"
            multilinea
            valor={mensaje}
            onCambiar={setMensaje}
            error={errores.mensaje}
            mostrarValido={intentoEnviar}
            placeholder="Cuéntanos en qué te podemos ayudar..."
            ayuda={`${mensaje.trim().length} de 500 caracteres (mínimo 10).`}
          />
        </div>
      </div>

      <p className="small text-body-secondary mt-2 mb-3">Los campos con * son obligatorios.</p>

      <button type="submit" className="btn btn-danger align-self-start">
        Enviar mensaje
      </button>
    </form>
  )
}

export default FormularioContacto

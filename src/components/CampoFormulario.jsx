/* ==========================================================
   CampoFormulario: un campo con su etiqueta y su mensaje de error.
   Es un componente reutilizable: lo usan el formulario de contacto
   y el formulario del panel admin, así ambos se ven y validan igual.

   Usa las clases de validación de Bootstrap:
     is-invalid        borde rojo + muestra el div invalid-feedback
     is-valid          borde verde cuando el dato ya está correcto

   Props:
     id            id del input (lo une con su label)
     etiqueta      texto del label
     valor         valor actual (viene del estado del formulario padre)
     onCambiar     función que recibe el nuevo texto
     error         mensaje de error ('' o undefined = sin error)
     mostrarValido true para pintar en verde si no hay error
     tipo          type del input (text, email, number...)
     multilinea    true para usar <textarea> en vez de <input>
     placeholder   texto de ejemplo
     ayuda         texto pequeño bajo el campo (opcional)
   ========================================================== */
function CampoFormulario({
  id,
  etiqueta,
  valor,
  onCambiar,
  error,
  mostrarValido = false,
  tipo = 'text',
  multilinea = false,
  placeholder = '',
  ayuda = '',
}) {
  let claseEstado = ''
  if (error) claseEstado = 'is-invalid'
  else if (mostrarValido) claseEstado = 'is-valid'

  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`

  // Props comunes para <input> y <textarea>
  const propsCampo = {
    id,
    className: `form-control ${claseEstado}`,
    value: valor,
    placeholder,
    onChange: (evento) => onCambiar(evento.target.value),
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? idError : ayuda ? idAyuda : undefined,
  }

  return (
    <div className="campo-formulario">
      <label htmlFor={id} className="form-label small mb-1">
        {etiqueta}
      </label>

      {/* Renderizado condicional: textarea para textos largos, input para el resto */}
      {multilinea ? <textarea rows="4" {...propsCampo} /> : <input type={tipo} {...propsCampo} />}

      {error && (
        <div id={idError} className="invalid-feedback">
          {error}
        </div>
      )}
      {!error && ayuda && (
        <div id={idAyuda} className="form-text">
          {ayuda}
        </div>
      )}
    </div>
  )
}

export default CampoFormulario

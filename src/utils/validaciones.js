import { normalizarTexto } from './formato.js'

/* ==========================================================
   Funciones de validación (JavaScript puro, sin React).
   Cada función recibe los datos de un formulario y devuelve
   un objeto con los errores encontrados, uno por campo:
     { email: 'El email no tiene un formato válido.' }
   Si el objeto viene vacío, los datos están correctos.
   ========================================================== */

// Expresiones regulares reutilizables
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
const REGEX_NOMBRE_PERSONA = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]+$/

/**
 * Devuelve true si el objeto de errores tiene al menos un error.
 */
export function tieneErrores(errores) {
  return Object.keys(errores).length > 0
}

/**
 * Valida el formulario de contacto (nombre, email y mensaje).
 */
export function validarContacto({ nombre, email, mensaje }) {
  const errores = {}
  const nombreLimpio = nombre.trim()
  const emailLimpio = email.trim()
  const mensajeLimpio = mensaje.trim()

  if (nombreLimpio === '') {
    errores.nombre = 'Escribe tu nombre.'
  } else if (nombreLimpio.length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 letras.'
  } else if (!REGEX_NOMBRE_PERSONA.test(nombreLimpio)) {
    errores.nombre = 'El nombre solo puede tener letras y espacios.'
  }

  if (emailLimpio === '') {
    errores.email = 'Escribe tu email.'
  } else if (!REGEX_EMAIL.test(emailLimpio)) {
    errores.email = 'El email no tiene un formato válido. Ejemplo: nombre@correo.cl'
  }

  if (mensajeLimpio === '') {
    errores.mensaje = 'Escribe tu mensaje.'
  } else if (mensajeLimpio.length < 10) {
    errores.mensaje = `El mensaje debe tener al menos 10 caracteres (llevas ${mensajeLimpio.length}).`
  } else if (mensajeLimpio.length > 500) {
    errores.mensaje = 'El mensaje no puede superar los 500 caracteres.'
  }

  return errores
}

/**
 * Revisa que un texto sea una URL que empiece con http:// o https://.
 * new URL() lanza un error si el texto no es una dirección válida.
 */
function esUrlValida(texto) {
  try {
    const url = new URL(texto)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Valida el formulario del panel admin antes de publicar un juego
 * (sugerencia del feedback S8). Recibe también el catálogo actual
 * para no permitir dos juegos con el mismo nombre.
 */
export function validarVideojuego(datos, catalogo) {
  const errores = {}
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  const imagen = datos.imagen.trim()
  const precio = Number(datos.precio)
  const stock = Number(datos.stock)

  if (nombre === '') {
    errores.nombre = 'Escribe el nombre del juego.'
  } else if (nombre.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
  } else if (catalogo.some((juego) => normalizarTexto(juego.nombre) === normalizarTexto(nombre))) {
    errores.nombre = 'Ya existe un juego con ese nombre en el catálogo.'
  }

  if (descripcion === '') {
    errores.descripcion = 'Escribe una descripción corta.'
  } else if (descripcion.length < 10) {
    errores.descripcion = 'La descripción debe tener al menos 10 caracteres.'
  } else if (descripcion.length > 200) {
    errores.descripcion = 'La descripción no puede superar los 200 caracteres.'
  }

  if (datos.precio === '') {
    errores.precio = 'Escribe el precio normal.'
  } else if (!Number.isInteger(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser un número entero mayor a 0 (sin puntos).'
  }

  if (datos.precioOferta !== '') {
    const oferta = Number(datos.precioOferta)
    if (!Number.isInteger(oferta) || oferta <= 0) {
      errores.precioOferta = 'El precio oferta debe ser un número entero mayor a 0.'
    } else if (!errores.precio && oferta > precio) {
      errores.precioOferta = 'El precio oferta no puede ser mayor al precio normal.'
    }
  }

  if (datos.stock === '' || !Number.isInteger(stock) || stock < 1 || stock > 999) {
    errores.stock = 'El stock debe ser un número entero entre 1 y 999.'
  }

  if (imagen !== '' && !esUrlValida(imagen)) {
    errores.imagen = 'La URL debe empezar con http:// o https://'
  }

  return errores
}

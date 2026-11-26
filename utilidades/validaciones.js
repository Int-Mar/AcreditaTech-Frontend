export const REGLA_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{5,25}$/;
// Correo: solo @gmail.com, @outlook.com o @hotmail.com (igual que el backend)
export const REGLA_CORREO = /^[A-Za-z0-9._%+\-]+@(gmail|outlook|hotmail)\.com$/i;
export const REGLA_TELEFONO = /^55\d{8}$/;
export const REGLA_CONTRASENA =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\x21-\x7E]{8,20}$/;
export const REGLA_CURP =
  /^[A-Z]{4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HMX][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

export function validarNombre(valor) {
  return REGLA_NOMBRE.test(valor.trim())
    ? ""
    : "Nombre: solo letras y espacios, entre 5 y 25 caracteres";
}

export function validarTelefono(valor) {
  return REGLA_TELEFONO.test(valor)
    ? ""
    : "Teléfono: 10 dígitos que empiecen con 55";
}

export function validarCorreo(valor) {
  const correo = valor.trim();
  return correo.length <= 50 && REGLA_CORREO.test(correo)
    ? ""
    : "Correo: debe ser @gmail.com, @outlook.com o @hotmail.com, de máximo 50 caracteres y sin símbolos raros";
}

export function validarContrasena(valor) {
  return REGLA_CONTRASENA.test(valor)
    ? ""
    : "Contraseña: de 8 a 20 caracteres, con mayúscula, minúscula, número y símbolo (sin espacios)";
}

export function validarCurp(valor) {
  return REGLA_CURP.test(valor.trim().toUpperCase())
    ? ""
    : "CURP: revisa que tenga el formato correcto (18 letras y números)";
}

export function validarRegistro(form) {
  const errores = {};
  const revisiones = {
    nombre: validarNombre(form.nombre),
    telefono: validarTelefono(form.telefono),
    correo: validarCorreo(form.correo),
    contrasena: validarContrasena(form.contrasena),
    curp: validarCurp(form.curp),
  };

  for (const [campo, mensaje] of Object.entries(revisiones)) {
    if (mensaje) errores[campo] = mensaje;
  }

  if (!form.id_alcaldia) errores.id_alcaldia = "Selecciona tu alcaldía";
  if (!form.id_oficio) errores.id_oficio = "Selecciona tu oficio";
  if (!form.acepta_terminos)
    errores.acepta_terminos = "Debes aceptar los términos y condiciones";

  return errores;
}

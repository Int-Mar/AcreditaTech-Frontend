import axios from 'axios';
import { leerToken, borrarToken } from './peticiones';

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` }
});

export async function obtenerEstatus() {
  const res = await axios.get('/api/administracion/estatus', encabezadoAuth());
  return res.data;
}

export async function obtenerPadron(tipo, filtros = {}) {
  const params = {};
  Object.keys(filtros).forEach((clave) => {
    if (filtros[clave]) params[clave] = filtros[clave];
  });
  const res = await axios.get(`/api/administracion/padron/${tipo}`, {
    ...encabezadoAuth(),
    params
  });
  return res.data;
}
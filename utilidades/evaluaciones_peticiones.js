import axios from 'axios';
import { leerToken } from './peticiones';

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` }
});

export async function iniciarTest(tipo) {
  const res = await axios.post(`/api/evaluaciones/${tipo}/iniciar`, {}, encabezadoAuth());
  return res.data;
}

export async function obtenerPregunta(tipo) {
  const res = await axios.get(`/api/evaluaciones/${tipo}/pregunta`, encabezadoAuth());
  return res.data;
}

export async function responderPregunta(tipo, id_pregunta, id_opcion) {
  const res = await axios.post(
    `/api/evaluaciones/${tipo}/respuesta`,
    { id_pregunta, id_opcion },
    encabezadoAuth()
  );
  return res.data;
}

export async function obtenerEstadoTest(tipo) {
  const res = await axios.get(`/api/evaluaciones/${tipo}/estado`, encabezadoAuth());
  return res.data;
}
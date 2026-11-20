import axios from "axios";
import { leerToken } from "./peticiones";

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

// GET /api/avance
// Regresa { porcentaje, estatus, tecnica, salud } del usuario con sesión.
export async function obtenerAvance() {
  const res = await axios.get("/api/avance", encabezadoAuth());
  return res.data;
}

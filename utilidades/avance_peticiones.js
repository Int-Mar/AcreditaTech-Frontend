import axios from "axios";
import { leerToken } from "./peticiones";

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

export async function obtenerAvance() {
  const res = await axios.get("/api/avance", encabezadoAuth());
  return res.data;
}

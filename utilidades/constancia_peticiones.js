import axios from "axios";
import { leerToken } from "./peticiones";

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

export async function obtenerEstadoConstancia() {
  const res = await axios.get("/api/constancia", encabezadoAuth());
  return res.data;
}

export async function descargarConstanciaPdf() {
  try {
    const res = await axios.get("/api/constancia/pdf", {
      ...encabezadoAuth(),
      responseType: "blob",
    });

    const cabecera = res.headers["content-disposition"] || "";
    const coincidencia = cabecera.match(/filename="([^"]+)"/);
    const nombre = coincidencia ? coincidencia[1] : "pre-constancia.pdf";

    const url = window.URL.createObjectURL(res.data);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    if (err.response && err.response.data instanceof Blob) {
      try {
        err.response.data = JSON.parse(await err.response.data.text());
      } catch (e) {}
    }
    throw err;
  }
}

export async function renovarConstancia() {
  const res = await axios.post("/api/constancia/renovar", {}, encabezadoAuth());
  return res.data;
}

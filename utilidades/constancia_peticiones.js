import axios from "axios";
import { leerToken } from "./peticiones";

const encabezadoAuth = () => ({
  headers: { Authorization: `Bearer ${leerToken()}` },
});

// GET /api/constancia
// Regresa si ya tiene Pre-Constancia, si puede generarla, su folio y su vigencia.
export async function obtenerEstadoConstancia() {
  const res = await axios.get("/api/constancia", encabezadoAuth());
  return res.data;
}

// GET /api/constancia/pdf
// Pide el PDF con el token y hace que el navegador lo descargue.
// Se pide como "blob" (archivo) porque el PDF no es JSON.
export async function descargarConstanciaPdf() {
  try {
    const res = await axios.get("/api/constancia/pdf", {
      ...encabezadoAuth(),
      responseType: "blob",
    });

    // El nombre del archivo viene en el encabezado Content-Disposition
    const cabecera = res.headers["content-disposition"] || "";
    const coincidencia = cabecera.match(/filename="([^"]+)"/);
    const nombre = coincidencia ? coincidencia[1] : "pre-constancia.pdf";

    // Se crea un enlace temporal y se hace clic en él para guardar el archivo
    const url = window.URL.createObjectURL(res.data);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    // Si el servidor responde con error, el mensaje llega dentro de un blob:
    // se lee para que la pantalla pueda mostrar el texto real.
    if (err.response && err.response.data instanceof Blob) {
      try {
        err.response.data = JSON.parse(await err.response.data.text());
      } catch (e) {
        // si no era JSON se deja como estaba
      }
    }
    throw err;
  }
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LayoutTest from "../../componentes/LayoutTest";
import { leerToken, borrarToken } from "../../utilidades/peticiones";
import {
  obtenerEstadoConstancia,
  descargarConstanciaPdf,
} from "../../utilidades/constancia_peticiones";
import estilos from "../../estilos/constancia.module.css";

// Convierte la fecha que manda el Backend a texto: 19/11/2026
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Una cajita con etiqueta pequeña y valor
function Dato({ etiqueta, valor }) {
  return (
    <div className={estilos.dato}>
      <p className={estilos.datoEtiqueta}>{etiqueta}</p>
      <p className={estilos.datoValor}>{valor}</p>
    </div>
  );
}

export default function Constancia() {
  const router = useRouter();
  const [constancia, setConstancia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    // Sin sesión no se puede ver la Pre-Constancia
    if (!leerToken()) {
      router.push("/login");
      return;
    }

    obtenerEstadoConstancia()
      .then(setConstancia)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          borrarToken();
          router.push("/login");
          return;
        }
        setError(
          "No pudimos cargar tu Pre-Constancia. Intenta de nuevo en un momento.",
        );
      })
      .finally(() => setCargando(false));
  }, []);

  // Descarga el PDF y vuelve a pedir el estado (la primera vez se crea el folio)
  async function descargar() {
    setDescargando(true);
    try {
      await descargarConstanciaPdf();
      setConstancia(await obtenerEstadoConstancia());
    } catch (err) {
      console.error("No se pudo descargar la Pre-Constancia:", err);
    } finally {
      setDescargando(false);
    }
  }

  // El botón se habilita si ya tiene una constancia vigente
  // o si todavía no tiene pero ya aprobó las dos evaluaciones.
  const vigente =
    constancia &&
    constancia.tiene_constancia &&
    constancia.estado === "Vigente";
  const puedeDescargar = constancia && (vigente || constancia.puede_generar);

  return (
    <LayoutTest>
      <main className={estilos.contenedor}>
        {cargando && (
          <p className={estilos.mensaje}>Cargando tu Pre-Constancia...</p>
        )}

        {error && (
          <p className={`${estilos.mensaje} ${estilos.mensajeError}`}>
            {error}
          </p>
        )}

        {constancia && (
          <section className={estilos.tarjeta}>
            <div className={estilos.encabezado}>
              <h2 className={estilos.titulo}>Pre-Constancia de Preparación</h2>
              {constancia.tiene_constancia && (
                <span
                  className={`${estilos.estado} ${
                    vigente ? estilos.estadoVigente : estilos.estadoVencida
                  }`}
                >
                  {constancia.estado}
                </span>
              )}
            </div>

            <p className={estilos.texto}>
              Documento informativo en PDF con tu nombre, oficio, alcaldía y
              vigencia de 12 meses. Se habilita cuando apruebas la evaluación
              técnica y la de salud.
            </p>

            {constancia.tiene_constancia && (
              <div className={estilos.datos}>
                <Dato etiqueta="Folio" valor={constancia.codigo} />
                <Dato
                  etiqueta="Fecha de emisión"
                  valor={formatearFecha(constancia.emitida)}
                />
                <Dato
                  etiqueta="Vigente hasta"
                  valor={formatearFecha(constancia.vigente_hasta)}
                />
              </div>
            )}

            <button
              className={`${estilos.boton} ${puedeDescargar ? "" : estilos.botonInactivo}`}
              disabled={!puedeDescargar || descargando}
              onClick={descargar}
            >
              {descargando
                ? "Descargando..."
                : "Descargar Pre-Constancia Digital"}
            </button>
          </section>
        )}
      </main>
    </LayoutTest>
  );
}

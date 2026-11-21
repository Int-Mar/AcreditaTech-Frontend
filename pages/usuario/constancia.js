import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LayoutTest from "../../componentes/LayoutTest";
import { leerToken, borrarToken } from "../../utilidades/peticiones";
import {
  obtenerEstadoConstancia,
  descargarConstanciaPdf,
  renovarConstancia,
} from "../../utilidades/constancia_peticiones";
import estilos from "../../estilos/constancia.module.css";

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

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
  const [errorDescarga, setErrorDescarga] = useState("");
  const [renovando, setRenovando] = useState(false);
  const [errorRenovar, setErrorRenovar] = useState("");

  useEffect(() => {
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

  async function descargar() {
    setDescargando(true);
    setErrorDescarga("");
    try {
      await descargarConstanciaPdf();
      setConstancia(await obtenerEstadoConstancia());
    } catch (err) {
      const mensaje =
        err.response && err.response.data && err.response.data.mensaje;
      setErrorDescarga(
        mensaje || "No se pudo descargar tu Pre-Constancia. Intenta de nuevo.",
      );
    } finally {
      setDescargando(false);
    }
  }

  async function renovar() {
    const confirmar = window.confirm(
      "Se reiniciarán tus evaluaciones y tendrás que presentarlas de nuevo. ¿Quieres continuar?",
    );
    if (!confirmar) return;
    setRenovando(true);
    setErrorRenovar("");
    try {
      await renovarConstancia();
      router.push("/usuario/progreso");
    } catch (err) {
      const mensaje =
        err.response && err.response.data && err.response.data.mensaje;
      setErrorRenovar(
        mensaje || "No se pudo renovar tu Pre-Constancia. Intenta de nuevo.",
      );
      setRenovando(false);
    }
  }

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

            {!constancia.tiene_constancia && !constancia.puede_generar && (
              <p className={estilos.aviso}>
                Aún no puedes generar tu Pre-Constancia. Aprueba la evaluación
                técnica y la de salud ocupacional.{" "}
                <a href="/usuario/progreso" className={estilos.enlace}>
                  Ver mi avance
                </a>
              </p>
            )}

            {constancia.tiene_constancia && !vigente && (
              <p className={`${estilos.aviso} ${estilos.avisoError}`}>
                Tu Pre-Constancia venció el{" "}
                {formatearFecha(constancia.vigente_hasta)}. Para renovarla,
                vuelve a presentar tus evaluaciones.{" "}
                <a href="/usuario/progreso" className={estilos.enlace}>
                  Ver mi avance
                </a>
              </p>
            )}

            {errorDescarga && (
              <p className={`${estilos.aviso} ${estilos.avisoError}`}>
                {errorDescarga}
              </p>
            )}

            {errorRenovar && (
              <p className={`${estilos.aviso} ${estilos.avisoError}`}>
                {errorRenovar}
              </p>
            )}

            {constancia.tiene_constancia && !vigente && (
              <button
                className={estilos.boton}
                disabled={renovando}
                onClick={renovar}
              >
                {renovando ? "Renovando..." : "Renovar Pre-Constancia"}
              </button>
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

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LayoutTest from "../../componentes/LayoutTest";
import BarraAvance from "../../componentes/BarraAvance";
import { leerToken, borrarToken } from "../../utilidades/peticiones";
import { obtenerAvance } from "../../utilidades/avance_peticiones";
import estilos from "../../estilos/progreso.module.css";

// Devuelve la clase de color según el estatus
function claseEstatus(estatus) {
  if (estatus === "Preparación Completada") return estilos.estatusCompleto;
  if (estatus === "Vencida") return estilos.estatusVencida;
  return "";
}

// Una línea del checklist: ✓ si está aprobada, vacía si falta
function ItemChecklist({ texto, aprobada }) {
  return (
    <li className={estilos.checklistItem}>
      <span
        className={`${estilos.marca} ${aprobada ? estilos.marcaListo : ""}`}
      >
        {aprobada ? "✓" : ""}
      </span>
      {texto}: {aprobada ? "aprobada" : "pendiente"}
    </li>
  );
}

// Tarjeta de una evaluación (usa las clases de globals.css)
function TarjetaEvaluacion({
  titulo,
  descripcion,
  ruta,
  intentos,
  valor,
  detalle,
}) {
  return (
    <div className="progress-card">
      <div className="progress-card-info">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <a href={ruta} className="btn-volver-empezar">
          {intentos === 0 ? "Empezar" : "Volver a empezar"}
        </a>
      </div>
      <div className="progress-badge-box">
        <div className="progress-percentage">{valor}</div>
        <div className="progress-details">{detalle}</div>
      </div>
    </div>
  );
}

// Máximo de intentos por evaluación (el mismo valor que usa el Backend)
const MAX_INTENTOS = 5;

export default function Progreso() {
  const router = useRouter();
  const [avance, setAvance] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Sin sesión no se puede ver el avance
    if (!leerToken()) {
      router.push("/login");
      return;
    }

    obtenerAvance()
      .then(setAvance)
      .catch((err) => {
        // Token vencido o inválido: se borra y se manda a iniciar sesión
        if (err.response && err.response.status === 401) {
          borrarToken();
          router.push("/login");
          return;
        }
        setError(
          "No pudimos cargar tu avance. Intenta de nuevo en un momento.",
        );
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <LayoutTest>
      <main className="progress-content-grid">
        {cargando && <p className={estilos.mensaje}>Cargando tu avance...</p>}

        {error && (
          <p className={`${estilos.mensaje} ${estilos.mensajeError}`}>
            {error}
          </p>
        )}

        {avance && (
          <section className={estilos.resumen}>
            <div className={estilos.resumenEncabezado}>
              <h2 className={estilos.resumenTitulo}>Tu avance general</h2>
              <span
                className={`${estilos.estatus} ${claseEstatus(avance.estatus)}`}
              >
                {avance.estatus}
              </span>
            </div>

            <BarraAvance porcentaje={avance.porcentaje} />

            <ul className={estilos.checklist}>
              <ItemChecklist
                texto="Evaluación técnica"
                aprobada={avance.tecnica.aprobada}
              />
              <ItemChecklist
                texto="Salud ocupacional"
                aprobada={avance.salud.aprobada}
              />
            </ul>
          </section>
        )}

        {avance && (
          <>
            <TarjetaEvaluacion
              titulo="Test Técnico"
              descripcion="Resuelve casos prácticos de tu oficio y demuestra lo que sabes."
              ruta="/usuario/test-tecnico"
              intentos={avance.tecnica.intentos}
              valor={`${avance.tecnica.calificacion}`}
              detalle={`Puntos de 100 · Intentos: ${avance.tecnica.intentos} de ${MAX_INTENTOS}`}
            />
            <TarjetaEvaluacion
              titulo="Salud Ocupacional"
              descripcion="Lee cada situación y elige cómo actuarías para cuidar tu salud en el trabajo."
              ruta="/usuario/test-salud"
              intentos={avance.salud.intentos}
              valor={avance.salud.estado}
              detalle={`Intentos: ${avance.salud.intentos} de ${MAX_INTENTOS}`}
            />
          </>
        )}
      </main>
    </LayoutTest>
  );
}

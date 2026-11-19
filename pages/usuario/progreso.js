import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LayoutTest from "../../componentes/LayoutTest";
import BarraAvance from "../../componentes/BarraAvance";
import { leerToken } from "../../utilidades/peticiones";
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

export default function Progreso() {
  const router = useRouter();
  const [avance, setAvance] = useState(null);

  useEffect(() => {
    // Sin sesión no se puede ver el avance
    if (!leerToken()) {
      router.push("/login");
      return;
    }

    obtenerAvance().then(setAvance);
  }, []);

  return (
    <LayoutTest>
      <main className="progress-content-grid">
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
      </main>
    </LayoutTest>
  );
}

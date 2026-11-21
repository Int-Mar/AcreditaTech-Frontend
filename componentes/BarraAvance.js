import estilos from "../estilos/progreso.module.css";

export default function BarraAvance({ porcentaje }) {
  const valor = Math.max(0, Math.min(100, Number(porcentaje) || 0));

  return (
    <div>
      <div
        className={estilos.barra}
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance general de preparación"
      >
        <div className={estilos.barraRelleno} style={{ width: `${valor}%` }} />
      </div>
      <p className={estilos.barraTexto}>{valor}%</p>
    </div>
  );
}

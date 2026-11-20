import estilos from "../estilos/progreso.module.css";

// Barra de progreso de 0% a 100%.
// Recibe el porcentaje (número) y lo dibuja con su texto debajo.
export default function BarraAvance({ porcentaje }) {
  // Se asegura de que el valor esté entre 0 y 100
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

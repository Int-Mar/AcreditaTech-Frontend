// /admin/estadisticas — Totales por estatus, oficio, alcaldía y promedios

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import { obtenerEstadisticas } from '../../utilidades/administracion_peticiones';
import estilos from '../../estilos/salud.module.css';

export default function EstadisticasAdmin() {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setDatos(await obtenerEstadisticas());
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) {
          setError(e.response?.data?.error || 'No se pudieron cargar las estadísticas');
        }
      }
    }
    cargar();
  }, []);

  return (
    <LayoutAdmin activo="estadisticas">
      <main className="admin-content-area">
        <div className={estilos.contenedor}>
          <h2 className={estilos.titulo}>Estadísticas</h2>

          {error && <p className={estilos.error}>{error}</p>}
          {!datos && !error && <p>Cargando...</p>}

          {datos && (
            <>
              <section className={estilos.tarjeta}>
                <h3 className={estilos.titulo}>Total de trabajadores</h3>
                <p style={{ fontSize: '2rem', margin: 0 }}>
                  <strong>{datos.total_usuarios}</strong>
                </p>
              </section>


            </>
          )}
        </div>
      </main>
    </LayoutAdmin>
  );
}
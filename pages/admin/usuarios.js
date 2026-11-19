// /admin/usuarios — Lista de usuarios con buscador, filtros y bloqueo

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import { listarUsuarios } from '../../utilidades/administracion_peticiones';
import estilos from '../../estilos/admin.module.css';

const COLUMNAS = { gridTemplateColumns: '1.6fr 2fr 1.4fr 1.4fr 1.4fr' };

export default function UsuariosAdmin() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargar({});
  }, []);

  async function cargar(filtrosAplicados) {
    setCargando(true);
    setError('');
    try {
      setUsuarios(await listarUsuarios(filtrosAplicados));
    } catch (e) {
      if (!redirigirSiNoAutorizado(e, router)) {
        setError(e.response?.data?.error || 'Error al obtener los usuarios');
        setUsuarios([]);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <LayoutAdmin activo="usuarios">
      <main className="admin-content-area">

        {error && <p className={estilos.mensajeError}>{error}</p>}

        <div className="admin-table-wrapper">
          <div className="admin-table-card">
            <div className="admin-table-header" style={COLUMNAS}>
              <span>Nombre</span>
              <span>Correo</span>
              <span>Alcaldía</span>
              <span>Oficio</span>
              <span>Estatus</span>
            </div>
            <div className="admin-table-body">
              {cargando && <p className={estilos.mensajeTabla}>Cargando...</p>}

              {!cargando && usuarios.length === 0 && (
                <p className={estilos.mensajeTabla}>No se encontraron usuarios</p>
              )}

              {!cargando && usuarios.map((u) => (
                <div className="admin-table-row" key={u.id_usuario} style={COLUMNAS}>
                  <span>{u.nombre}</span>
                  <span>{u.correo}</span>
                  <span>{u.nombre_alcaldia}</span>
                  <span>{u.nombre_oficio}</span>
                  <span>{u.estatus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </LayoutAdmin>
  );
}
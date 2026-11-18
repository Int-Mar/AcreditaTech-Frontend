import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutAdmin from '../../componentes/admin/LayoutAdmin';
import { obtenerEstatus, cambiarEstatus, redirigirSiNoAutorizado } from '../../utilidades/admin_peticiones';
import estilos from '../../estilos/admin.module.css';

export default function ModificarEstatus() {
  const router = useRouter();
  const [listaEstatus, setListaEstatus] = useState([]);
  const [correo, setCorreo] = useState('');
  const [estatus, setEstatus] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargarEstatus() {
      try {
        const data = await obtenerEstatus();
        setListaEstatus(data.todos);
      } catch (e) {
        if (!redirigirSiNoAutorizado(e, router)) {
          setMensaje({ texto: 'No se pudieron cargar los estatus', tipo: 'error' });
        }
      }
    }
    cargarEstatus();
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setEnviando(true);
    try {
      const data = await cambiarEstatus(correo, estatus);
      setMensaje({ texto: data.mensaje, tipo: 'exito' });
      setCorreo('');
      setEstatus('');
    } catch (err) {
      if (!redirigirSiNoAutorizado(err, router)) {
        setMensaje({
          texto: err.response?.data?.mensaje || 'Error al cambiar el estatus',
          tipo: 'error'
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <LayoutAdmin activo="estatus">
      <main className="status-content-area">
        <div className="status-card">
          <h2 className="status-card-title">Modificar Estatus</h2>
        </div>
      </main>
    </LayoutAdmin>
  );
}
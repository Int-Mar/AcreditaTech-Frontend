// BarraLateral.js
// Barra lateral del trabajador. La usan el menú, el perfil y todas las
// pantallas con LayoutTest, para que en todas se vea y se comporte igual:
// mismos nombres, el botón de la pantalla actual iluminado y aviso al salir.

import Link from 'next/link';
import { useRouter } from 'next/router';
import { borrarToken } from '../utilidades/peticiones';

// Qué botón se ilumina en cada pantalla
const SECCION_POR_RUTA = {
  '/usuario/menu': 'inicio',
  '/usuario/progreso': 'progreso',
  '/usuario/test-salud': 'progreso',
  '/usuario/test-tecnico': 'progreso',
  '/usuario/constancia': 'progreso',
  '/usuario/guias': 'guias',
  '/usuario/ficha-salud': 'guias',
  '/usuario/perfil': 'perfil',
};

const ARRIBA = [
  { id: 'inicio', ruta: '/usuario/menu', titulo: 'Inicio', icono: '/img/Inicio.png' },
  { id: 'progreso', ruta: '/usuario/progreso', titulo: 'Progreso', icono: '/img/Progreso.png' },
  { id: 'guias', ruta: '/usuario/guias', titulo: 'Guías', icono: '/img/Guias.png' },
];

export default function BarraLateral() {
  const router = useRouter();
  const actual = SECCION_POR_RUTA[router.pathname];

  const clase = (id) => 'nav-item' + (actual === id ? ' active' : '');

  function confirmarSalida(e) {
    if (!window.confirm('¿Seguro que quieres cerrar sesión?')) {
      e.preventDefault();
      return;
    }
    borrarToken();
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {ARRIBA.map((item) => (
          <Link key={item.id} href={item.ruta} className={clase(item.id)} title={item.titulo}>
            <img src={item.icono} alt={item.titulo} className="nav-icon" />
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <Link href="/usuario/perfil" className={clase('perfil')} title="Perfil">
          <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
        </Link>

        <Link href="/login" className="nav-item" title="Salir" onClick={confirmarSalida}>
          <img src="/img/Salir.png" alt="Salir" className="nav-icon" />
        </Link>
      </div>
    </aside>
  );
}

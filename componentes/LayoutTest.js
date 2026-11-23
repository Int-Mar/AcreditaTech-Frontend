import { useEffect } from 'react';
import BarraLateral from './BarraLateral';

export default function LayoutTest({ children }) {

  useEffect(() => {
    document.body.classList.add('dashboard-body');
    return () => document.body.classList.remove('dashboard-body');
  }, []);

  return (
    <div className="dashboard-container">
      {/* Barra lateral (la misma en todas las pantallas del trabajador) */}
      <BarraLateral />

      {/* Área principal */}
      <div className="main-area">
        <header className="top-bar">
          <div className="logo-container">
            <img src="/img/LogoBlanco.png" alt="AcreditaTech Logo" className="logo-img" />
            <span className="logo-text">AcreditaTech</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
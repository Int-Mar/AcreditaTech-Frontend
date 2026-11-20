import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { leerToken, borrarToken } from "../../utilidades/peticiones";
import { obtenerAvance } from "../../utilidades/avance_peticiones";
import Link from "next/link";
import IconoOficio from "../../componentes/iconoOficio";

export default function MenuUsuario() {
  const router = useRouter();
  const [vencida, setVencida] = useState(false);

  useEffect(() => {
    if (!leerToken()) {
      router.push("/login");
      return;
    }

    // Si falla, el menú se muestra igual, solo sin la tarjeta de renovar
    obtenerAvance()
      .then((avance) => setVencida(avance.estatus === "Vencida"))
      .catch(() => {});
  }, []);

  function cerrarSesion() {
    borrarToken();
    router.push("/login");
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <Link href="/usuario/menu" className="nav-item" title="Inicio">
            <img src="/img/Inicio.png" alt="Inicio" className="nav-icon" />
          </Link>
          <Link href="/usuario/progreso" className="nav-item" title="Progreso">
            <img src="/img/Progreso.png" alt="Progreso" className="nav-icon" />
          </Link>
          <Link href="/usuario/guias" className="nav-item" title="Guías">
            <img src="/img/Guias.png" alt="Guías" className="nav-icon" />
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <Link href="/usuario/perfil" className="nav-item" title="Perfil">
            <img src="/img/Perfil.png" alt="Perfil" className="nav-icon" />
          </Link>
          <button
            onClick={cerrarSesion}
            className="nav-item"
            title="Salir"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img src="/img/Salir.png" alt="Salir" className="nav-icon" />
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="main-area">
        <header className="top-bar">
          <div className="logo-container">
            <img
              src="/img/LogoBlanco.png"
              alt="AcreditaTech"
              className="logo-img"
            />
            <span className="logo-text">AcreditaTech</span>
          </div>

          <div
            style={{
              marginLeft: "auto",
              paddingRight: "35px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconoOficio alto={48} />
          </div>
        </header>

        <main className="content-grid">
          <div className="test-card">
            <div className="card-info">
              <h3>Salud Ocupacional</h3>
              <p>Ingresa al test y averigua si eres una persona apta</p>
            </div>
            <a href="/usuario/test-salud" className="btn-empezar">
              Empezar
            </a>
          </div>

          <div className="test-card">
            <div className="card-info">
              <h3>Test Técnico</h3>
              <p>Ingresa al test y averigua si eres una persona apta</p>
            </div>
            <a href="/usuario/test-tecnico" className="btn-empezar">
              Empezar
            </a>
          </div>

          <div className="test-card">
            <div className="card-info">
              <h3>Pre-Constancia</h3>
              <p>Consulta tu estado y descarga tu Pre-Constancia en PDF</p>
            </div>
            <a href="/usuario/constancia" className="btn-empezar">
              Ver
            </a>
          </div>

          {vencida && (
            <div className="test-card">
              <div className="card-info">
                <h3>Renovar vigencia</h3>
                <p>
                  Tu Pre-Constancia venció. Vuelve a presentar tus evaluaciones
                  para renovarla
                </p>
              </div>
              <a href="/usuario/progreso" className="btn-empezar">
                Renovar
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

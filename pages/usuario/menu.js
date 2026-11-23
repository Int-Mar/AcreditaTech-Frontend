import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { leerToken } from "../../utilidades/peticiones";
import { obtenerAvance } from "../../utilidades/avance_peticiones";
import IconoOficio from "../../componentes/iconoOficio";
import BarraLateral from "../../componentes/BarraLateral";

export default function MenuUsuario() {
  const router = useRouter();
  const [vencida, setVencida] = useState(false);

  useEffect(() => {
    if (!leerToken()) {
      router.push("/login");
      return;
    }

    obtenerAvance()
      .then((avance) => setVencida(avance.estatus === "Vencida"))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-container">
      <BarraLateral />

      {}
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
              <a href="/usuario/constancia" className="btn-empezar">
                Renovar
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

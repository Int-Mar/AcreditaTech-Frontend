import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LayoutTest from "../../componentes/LayoutTest";
import { leerToken } from "../../utilidades/peticiones";
import estilos from "../../estilos/guias.module.css";

const PASOS = [
  {
    titulo: "Abre la aplicación",
    texto: "Entra a la aplicación móvil de AcreditaTech en tu celular.",
  },
  {
    titulo: "Inicia sesión",
    texto: "Usa el mismo correo y contraseña con los que te registraste aquí.",
  },
  {
    titulo: "Entra al Plan de Guías",
    texto:
      "Consulta guías rápidas, infografías y videos cortos de los temas que debes reforzar.",
  },
];

export default function Guias() {
  const router = useRouter();

  useEffect(() => {
    if (!leerToken()) {
      router.push("/login");
    }
  }, []);

  return (
    <LayoutTest>
      <main className={estilos.contenedor}>
        <section className={estilos.panel}>
          <div className={estilos.izquierda}>
            <p className={estilos.etiqueta}>PLAN DE GUÍAS</p>
            <h1 className={estilos.titulo}>
              Tus guías te esperan en la aplicación móvil
            </h1>
            <p className={estilos.subtitulo}>
              Las guías de refuerzo se consultan desde la aplicación móvil, para
              que las tengas siempre a la mano. Aquí en la web puedes ver tu
              avance y descargar tu Pre-Constancia.
            </p>
            <div className={estilos.botones}>
              <Link href="/usuario/progreso" className={estilos.boton}>
                Ver mi avance
              </Link>
              <Link
                href="/usuario/constancia"
                className={`${estilos.boton} ${estilos.botonSecundario}`}
              >
                Mi Pre-Constancia
              </Link>
              <Link
                href="/usuario/ficha-salud"
                className={`${estilos.boton} ${estilos.botonSecundario}`}
              >
                Ver Ficha Preventiva
              </Link>
            </div>
          </div>

          <div className={estilos.derecha}>
            <p className={estilos.listaTitulo}>CÓMO VER TUS GUÍAS</p>
            <ol className={estilos.lista}>
              {PASOS.map((paso, i) => (
                <li key={paso.titulo} className={estilos.paso}>
                  <span className={estilos.pasoNumero}>{i + 1}</span>
                  <div>
                    <p className={estilos.pasoTitulo}>{paso.titulo}</p>
                    <p className={estilos.pasoTexto}>{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </LayoutTest>
  );
}

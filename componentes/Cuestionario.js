import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { leerToken, obtenerPerfil } from '../utilidades/peticiones';
import {
  iniciarTest,
  obtenerPregunta,
  responderPregunta,
  obtenerEstadoTest,
} from '../utilidades/evaluaciones_peticiones';

const TEXTOS = {
  1: {
    titulo: 'Test Técnico',
    descripcion:
      'Este cuestionario presenta casos prácticos de tu oficio. Elige en cada uno la mejor opción.',
    etiqueta: 'Evaluación técnica',
    resultadoTitulo: 'Resultados Técnicos',
  },
  2: {
    titulo: 'Test Diagnóstico de Salud Ocupacional',
    descripcion:
      'Este cuestionario presenta casos sobre salud física en el trabajo. Elige en cada uno la mejor opción.',
    etiqueta: 'Evaluación de salud ocupacional',
    resultadoTitulo: 'Resultados Ocupacionales',
  },
};

function fondoDeOficio(nombreOficio) {
  const o = (nombreOficio || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (o.includes('electr'))  return '/img/fondo-electricista.png';
  if (o.includes('plom'))    return '/img/fondo-plomeria.png';
  if (o.includes('carpint')) return '/img/fondo-carpintero.png';
  if (o.includes('alban'))   return '/img/fondo-albanil.png';
  return null;
}

const estiloBoton = { border: 'none', cursor: 'pointer' };

export default function Cuestionario({ tipo }) {
  const router = useRouter();
  const textos = TEXTOS[tipo] || TEXTOS[1];

  const [fase, setFase] = useState('inicio');
  const [datos, setDatos] = useState(null);
  const [opcionElegida, setOpcionElegida] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [fondo, setFondo] = useState(null);

  useEffect(() => {
    if (!leerToken()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (tipo !== 1) return;
    obtenerPerfil()
      .then(data => {
        const info = data.perfil || data;
        setFondo(fondoDeOficio(info.nombre_oficio));
      })
      .catch(() => {});
  }, [tipo]);

  function manejarError(err) {
    if (err.response?.status === 401) {
      router.push('/login');
      return;
    }
    const data = err.response?.data;
    let mensaje = data?.mensaje || 'No se pudo conectar con el servidor';
    if (data?.horas_restantes) {
      mensaje += ` Faltan aproximadamente ${data.horas_restantes} hora(s).`;
    }
    setError(mensaje);
  }

  async function empezar() {
    setError('');
    setCargando(true);
    try {
      await iniciarTest(tipo);
      const pregunta = await obtenerPregunta(tipo);
      setDatos(pregunta);
      setOpcionElegida(null);
      setFase('pregunta');
    } catch (err) {
      manejarError(err);
    } finally {
      setCargando(false);
    }
  }

  async function enviar() {
    if (!opcionElegida) return;
    setError('');
    setCargando(true);
    try {
      const respuesta = await responderPregunta(
        tipo,
        datos.pregunta.id_pregunta,
        opcionElegida
      );

      if (respuesta.finalizado) {
        setResultado(respuesta);
        try {
          setEstado(await obtenerEstadoTest(tipo));
        } catch {
          setEstado(null);
        }
        setFase('resultado');
      } else {
        const siguiente = await obtenerPregunta(tipo);
        setDatos(siguiente);
        setOpcionElegida(null);
      }
    } catch (err) {
      manejarError(err);
    } finally {
      setCargando(false);
    }
  }

  const mensajeError = error && (
    <p style={{ color: 'red', fontSize: '0.9rem', margin: '0.5rem 0' }}>{error}</p>
  );

  if (fase === 'inicio') {
    return (
      <main className="test-intro-content-area">
        <div className="test-intro-card">
          <h2 className="test-intro-title">{textos.titulo}</h2>
          <p className="test-intro-desc">{textos.descripcion}</p>

          {mensajeError}

          <div className="test-intro-action">
            <button
              type="button"
              className="btn-iniciar-test"
              style={estiloBoton}
              onClick={empezar}
              disabled={cargando}
            >
              {cargando ? 'Cargando...' : 'Iniciar Test'}
            </button>
          </div>

          <span className="test-intro-footer-label">{textos.etiqueta}</span>
        </div>
      </main>
    );
  }

  if (fase === 'pregunta' && datos) {
    return (
      <main
        className={'quiz-content-area' + (tipo === 1 ? ' quiz-tecnico' : '')}
        style={tipo === 1 && fondo ? { backgroundImage: `url(${fondo})` } : undefined}
      >
        <div className="quiz-card-socrative">
          <div className="quiz-counter">
            Pregunta {datos.caso} de {datos.total_casos}
          </div>

          <div className="quiz-question-title">{datos.pregunta.texto}</div>

          <div className="quiz-options-container">
            {datos.pregunta.opciones.map((opcion) => (
              <button
                key={opcion.id_opcion}
                type="button"
                className={
                  'quiz-option-btn' +
                  (opcionElegida === opcion.id_opcion ? ' selected' : '')
                }
                onClick={() => setOpcionElegida(opcion.id_opcion)}
              >
                {opcion.texto}
              </button>
            ))}
          </div>

          {mensajeError}

          <div className="quiz-submit-container">
            <button
              type="button"
              className="btn-subir-respuesta"
              style={{
                cursor: 'pointer',
                opacity: !opcionElegida || cargando ? 0.5 : 1,
              }}
              onClick={enviar}
              disabled={!opcionElegida || cargando}
            >
              {cargando ? 'Enviando...' : 'Subir respuesta'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (fase === 'resultado' && resultado) {
    const aprobado = resultado.aprobado;

    return (
      <main className="result-content-area">
        <div className="result-card-container">
          <h2 className="result-main-title">{textos.resultadoTitulo}</h2>
          <p className="result-subtitle">Resultado obtenido</p>

          <div className={'result-score-box ' + (aprobado ? 'success' : 'danger')}>
            <span className="result-percentage">{resultado.calificacion}%</span>
            <span className="result-aciertos">
              Puntaje: {resultado.calificacion} de 100
            </span>
          </div>

          <div className="result-message-block">
            <h3 className="result-status-heading">¡Has terminado!</h3>
            <p className="result-status-text">
              {aprobado
                ? '¡Felicidades, has conseguido un buen puntaje y eres apto!'
                : 'Todavía no alcanzas el puntaje necesario. Puedes volver a intentarlo.'}
            </p>

            {!aprobado && estado && (
              <p className="result-status-text">
                Intentos usados: {estado.intentos_usados} de {estado.max_intentos}.
                {estado.bloqueado &&
                  ` Podrás intentarlo de nuevo el ${new Date(
                    estado.bloqueado_hasta
                  ).toLocaleString('es-MX')}.`}
              </p>
            )}
          </div>

          <div className="result-action-container">
            <Link href="/usuario/menu" className="btn-volver-panel">
              Volver a mi panel
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
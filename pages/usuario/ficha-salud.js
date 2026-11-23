// ficha-salud.js
// El trabajador llena su ficha de salud y ve su Ficha Preventiva.
// La Ficha Preventiva nunca muestra números, solo la etiqueta y las recomendaciones.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import LayoutTest from '../../componentes/LayoutTest';
import { leerToken } from '../../utilidades/peticiones';
import { obtenerFicha, guardarFicha, obtenerPreventiva } from '../../utilidades/salud_peticiones';
import estilos from '../../estilos/salud.module.css';

const NIVELES = ['Ninguno', 'Leve', 'Moderado', 'Fuerte'];

const EQUIPO = [
  ['usa_casco', 'Casco'],
  ['usa_guantes', 'Guantes'],
  ['usa_lentes', 'Lentes de seguridad'],
  ['usa_calzado_seguridad', 'Calzado de seguridad'],
];

const FICHA_VACIA = {
  dolor_espalda: '',
  dolor_hombros_cuello: '',
  horas_trabajo_dia: '',
  usa_casco: false,
  usa_guantes: false,
  usa_lentes: false,
  usa_calzado_seguridad: false,
  observaciones: '',
};

const NOMBRE_RIESGO = { rojo: 'Riesgo alto', amarillo: 'Riesgo medio', verde: 'Riesgo bajo' };

export default function FichaSalud() {
  const router = useRouter();
  const [ficha, setFicha] = useState(FICHA_VACIA);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);
  const [preventiva, setPreventiva] = useState(null);
  const [sinTest, setSinTest] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    if (!leerToken()) { router.push('/login'); return; }

    async function cargar() {
      try {
        const datos = await obtenerFicha();
        setFicha({
          ...FICHA_VACIA,
          ...Object.fromEntries(
            Object.entries(datos || {}).filter(
              ([campo, v]) => v !== null && campo in FICHA_VACIA
            )
          ),
        });
      } catch (e) {
        if (e.response?.status === 401) { router.push('/login'); return; }
      }

      try {
        const datos = await obtenerPreventiva();
        // Se asegura que las listas existan aunque el servidor no las mande
        setPreventiva({
          resultado: datos?.resultado || 'Pendiente',
          areas_a_reforzar: Array.isArray(datos?.areas_a_reforzar) ? datos.areas_a_reforzar : [],
          ficha_preventiva: Array.isArray(datos?.ficha_preventiva) ? datos.ficha_preventiva : [],
        });
      } catch (e) {
        if (e.response?.status === 401) { router.push('/login'); return; }
        if (e.response?.status === 404) setSinTest(true);
        else setErrorCarga('No se pudo cargar tu Ficha Preventiva. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function cambiar(campo, valor) {
    setFicha({ ...ficha, [campo]: valor });
  }

  async function enviar(e) {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setGuardando(true);
    try {
      await guardarFicha({
        dolor_espalda: ficha.dolor_espalda || null,
        dolor_hombros_cuello: ficha.dolor_hombros_cuello || null,
        horas_trabajo_dia:
          ficha.horas_trabajo_dia === '' ? null : Number(ficha.horas_trabajo_dia),
        usa_casco: ficha.usa_casco,
        usa_guantes: ficha.usa_guantes,
        usa_lentes: ficha.usa_lentes,
        usa_calzado_seguridad: ficha.usa_calzado_seguridad,
        observaciones: ficha.observaciones || null,
      });
      setMensaje({ texto: 'Ficha guardada correctamente', tipo: 'exito' });
    } catch (err) {
      if (err.response?.status === 401) { router.push('/login'); return; }
      setMensaje({
        texto: err.response?.data?.error || 'No se pudo guardar la ficha',
        tipo: 'error',
      });
    } finally {
      setGuardando(false);
    }
  }

  // En salud el resultado se guarda como Aprobado / No aprobado;
  // al trabajador se le muestra como Apto / Necesita reforzamiento
  const apto = preventiva?.resultado === 'Aprobado';
  const pendiente = !preventiva || preventiva.resultado === 'Pendiente';
  const claseEtiqueta = pendiente ? estilos.pendiente : apto ? estilos.apto : estilos.refuerzo;
  const textoEtiqueta = pendiente ? 'Pendiente' : apto ? 'Apto' : 'Necesita reforzamiento';
  const textoResultado = pendiente
    ? 'Termina el test de salud ocupacional para conocer tu resultado.'
    : apto
    ? 'Tus hábitos de trabajo son seguros. Revisa las recomendaciones para mantenerlos.'
    : 'Hay hábitos que ponen en riesgo tu salud. Revisa las áreas y recomendaciones de abajo.';

  return (
    <>
      <Head><title>AcreditaTech - Ficha Preventiva</title></Head>
      <LayoutTest>
        <main className={estilos.contenedor}>
          <div className={estilos.envoltura}>

            {/* ── Encabezado con el resultado ───────────────────────────── */}
            <section className={estilos.encabezado}>
              <div className={estilos.encabezadoTexto}>
                <p className={estilos.etiquetaSeccion}>SALUD OCUPACIONAL</p>
                <h1 className={estilos.tituloPrincipal}>Mi Ficha Preventiva</h1>
                <p className={estilos.subtitulo}>
                  Aquí ves cómo te fue en el test de salud ocupacional y qué puedes mejorar
                  para trabajar más seguro. No cambia tu resultado de acreditación.
                </p>
              </div>

              {!cargando && !sinTest && preventiva && (
                <div className={estilos.resultadoCaja}>
                  <span className={estilos.resultadoRotulo}>Tu resultado</span>
                  <span className={`${estilos.etiqueta} ${claseEtiqueta}`}>{textoEtiqueta}</span>
                  <p className={estilos.resultadoTexto}>{textoResultado}</p>
                </div>
              )}
            </section>

            {/* ── Contenido de la Ficha Preventiva ──────────────────────── */}
            {cargando && (
              <section className={estilos.tarjeta}>
                <p className={estilos.textoSuave}>Cargando tu Ficha Preventiva...</p>
              </section>
            )}

            {!cargando && errorCarga && (
              <section className={estilos.tarjeta}>
                <p className={estilos.error}>{errorCarga}</p>
              </section>
            )}

            {!cargando && sinTest && (
              <section className={`${estilos.tarjeta} ${estilos.vacio}`}>
                <div className={estilos.vacioIcono}>!</div>
                <h2 className={estilos.titulo}>Aún no tienes Ficha Preventiva</h2>
                <p className={estilos.textoSuave}>
                  Cuando termines el test de salud ocupacional, aquí verás tu resultado,
                  las áreas que debes reforzar y recomendaciones para trabajar seguro.
                </p>
                <Link href="/usuario/test-salud" className={estilos.boton}>Ir al test de salud</Link>
              </section>
            )}

            {!cargando && preventiva && (
              <div className={estilos.columnas}>
                <section className={estilos.tarjeta}>
                  <h2 className={estilos.titulo}>Áreas a reforzar</h2>
                  {preventiva.areas_a_reforzar.length === 0 ? (
                    <p className={estilos.textoSuave}>
                      No tienes áreas pendientes. ¡Buen trabajo!
                    </p>
                  ) : (
                    <>
                      <p className={estilos.textoSuave}>
                        En estos temas sacaste la mitad de los puntos o menos. Sus guías
                        están disponibles en la aplicación móvil.
                      </p>
                      <ul className={estilos.chips}>
                        {preventiva.areas_a_reforzar.map((a) => (
                          <li key={a} className={estilos.chip}>{a}</li>
                        ))}
                      </ul>
                      <Link href="/usuario/guias" className={`${estilos.boton} ${estilos.botonSecundario}`}>
                        Ver cómo consultar mis guías
                      </Link>
                    </>
                  )}
                </section>

                <section className={estilos.tarjeta}>
                  <h2 className={estilos.titulo}>Recomendaciones</h2>
                  <div className={estilos.leyenda}>
                    <span><i className={`${estilos.punto} ${estilos.puntoRojo}`} />Riesgo alto</span>
                    <span><i className={`${estilos.punto} ${estilos.puntoAmarillo}`} />Riesgo medio</span>
                  </div>
                  {preventiva.ficha_preventiva.length === 0 && (
                    <p className={estilos.textoSuave}>No hay recomendaciones pendientes. ¡Buen trabajo!</p>
                  )}
                  {preventiva.ficha_preventiva.map((item, i) => (
                    <article key={i} className={`${estilos.item} ${estilos[item.color] || ''}`}>
                      <div className={estilos.itemCabecera}>
                        <span className={estilos.itemTema}>{item.tema}</span>
                        {NOMBRE_RIESGO[item.color] && (
                          <span className={`${estilos.itemNivel} ${estilos['nivel_' + item.color]}`}>
                            {NOMBRE_RIESGO[item.color]}
                          </span>
                        )}
                      </div>
                      {item.pregunta && <p className={estilos.itemPregunta}>{item.pregunta}</p>}
                      <p className={estilos.itemRespuesta}>Tu respuesta: {item.respuesta}</p>
                      <p className={estilos.itemRecomendacion}>{item.recomendacion}</p>
                    </article>
                  ))}
                </section>
              </div>
            )}

            {/* ── Ficha de salud que llena el trabajador ────────────────── */}
            <section className={estilos.tarjeta}>
              <h2 className={estilos.titulo}>Mi ficha de salud ocupacional</h2>
              <p className={estilos.textoSuave}>
                Cuéntanos cómo te sientes y qué equipo usas. Puedes actualizarla cuando quieras.
              </p>
              <form onSubmit={enviar} className={estilos.formulario}>
                <div className={estilos.campo}>
                  <label>¿Tienes dolor de espalda?</label>
                  <select value={ficha.dolor_espalda}
                    onChange={(e) => cambiar('dolor_espalda', e.target.value)}>
                    <option value="">Elige una opción</option>
                    {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className={estilos.campo}>
                  <label>¿Tienes dolor de hombros o cuello?</label>
                  <select value={ficha.dolor_hombros_cuello}
                    onChange={(e) => cambiar('dolor_hombros_cuello', e.target.value)}>
                    <option value="">Elige una opción</option>
                    {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className={estilos.campo}>
                  <label>Horas de trabajo al día</label>
                  <input type="number" min="0" max="24" value={ficha.horas_trabajo_dia}
                    onChange={(e) => cambiar('horas_trabajo_dia', e.target.value)} />
                </div>

                <div className={`${estilos.campo} ${estilos.campoAncho}`}>
                  <label>Equipo de protección que usas</label>
                  <div className={estilos.casillas}>
                    {EQUIPO.map(([campo, texto]) => (
                      <label key={campo}
                        className={`${estilos.casilla} ${ficha[campo] ? estilos.casillaActiva : ''}`}>
                        <input type="checkbox" checked={!!ficha[campo]}
                          onChange={(e) => cambiar(campo, e.target.checked)} />
                        {texto}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={`${estilos.campo} ${estilos.campoAncho}`}>
                  <label>Observaciones (opcional)</label>
                  <textarea rows="3" maxLength="255" value={ficha.observaciones}
                    onChange={(e) => cambiar('observaciones', e.target.value)} />
                </div>

                <div className={estilos.campoAncho}>
                  <button type="submit" className={estilos.boton} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar ficha'}
                  </button>
                  {mensaje.texto && (
                    <p className={mensaje.tipo === 'exito' ? estilos.exito : estilos.error}>
                      {mensaje.texto}
                    </p>
                  )}
                </div>
              </form>
            </section>

          </div>
        </main>
      </LayoutTest>
    </>
  );
}

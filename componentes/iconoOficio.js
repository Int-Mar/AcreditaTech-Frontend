import { useState, useEffect } from 'react';
import { obtenerPerfil } from '../utilidades/peticiones';

function rutaIcono(nombreOficio) {
  const o = (nombreOficio || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase();

  if (o.includes('electr'))  return '/img/electricista.png';
  if (o.includes('plom'))    return '/img/plomeria.png';
  if (o.includes('carpint')) return '/img/carpintero.png';
  if (o.includes('alban'))   return '/img/albanil.png';
  return null;
}

export default function IconoOficio({ oficio, alto = 48 }) {
  const [nombre, setNombre] = useState(oficio || '');

  useEffect(() => {
    if (oficio) {
      setNombre(oficio);
      return;
    }
    obtenerPerfil()
      .then(data => {
        const info = data.perfil || data;
        setNombre(info.nombre_oficio || '');
      })
      .catch(() => {});
  }, [oficio]);

  const ruta = rutaIcono(nombre);
  if (!ruta) return null;

  return (
    <img
      src={ruta}
      alt={nombre}
      title={nombre}
      style={{ height: `${alto}px`, width: 'auto' }}
    />
  );
}
export interface Seccion {
  id: string;
  ruta: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  claseColor: string;
}

export const SECCIONES: Seccion[] = [
  {
    id: "cuentos",
    ruta: "/cuentos",
    nombre: "Cuentos",
    descripcion: "Descubre historias mágicas de la Costa, la Sierra y la Selva del Perú.",
    emoji: "📖",
    claseColor: "seccion-card--cuentos",
  },
  {
    id: "canciones",
    ruta: "/canciones",
    nombre: "Canciones",
    descripcion: "Canta y baila al ritmo de melodías tradicionales peruanas.",
    emoji: "🎵",
    claseColor: "seccion-card--canciones",
  },
  {
    id: "juegos",
    ruta: "/menu-juegos",
    nombre: "Juegos",
    descripcion: "Aprende jugando con retos sobre animales, comidas y regiones.",
    emoji: "🎮",
    claseColor: "seccion-card--juegos",
  },
];
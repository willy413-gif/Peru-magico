export type Juego = {
  id: number;
  nombre: string;
  objetivo: string;
  descripcion: string;
  imagen_url: string;
}

export const JUEGOS: Juego[] = [
  {
    id: 1,
    nombre: "Descubriendo la gastronomía peruana",
    objetivo: "Reconocer los platos típicos de cada región.",
    descripcion: "El niño deberá arrastrar o seleccionar imágenes de comidas típicas y colocarlas en la región correspondiente (Costa, Sierra o Selva).",
    imagen_url: "./juegos/comida.png",
  },
  {
    id: 2,
    nombre: "Vistiendo a nuestros amigos del Perú",
    objetivo: "Identificar las vestimentas representativas de cada región.",
    descripcion: "El niño deberá vestir a personajes utilizando prendas típicas de la Costa, Sierra o Selva.",
    imagen_url: "./juegos/vestir.png",
  },
  {
    id: 3,
    nombre: "¿De dónde soy?",
    objetivo: " Reconocer elementos culturales de cada región.",
    descripcion: "El niño observará imágenes de animales, instrumentos, alimentos o paisajes y deberá seleccionar la región a la que pertenecen.",
    imagen_url: "./juegos/ubicar.png",
  },
];


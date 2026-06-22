export interface Pregunta {
  texto: string;
  correcta: number; // índice en `opciones`
  opciones: { nombre: string; img: string; emoji: string }[];
}

export type Estado = "jugando" | "respondida" | "final";

/* ─── datos de las preguntas ─────────────────────────────────── */
export const PREGUNTAS: Pregunta[] = [
  {
    texto: "¿Quién vive cerca del mar con las olas y la arena?",
    correcta: 0,
    opciones: [
      { nombre: "Pelícano Pepe",  img: "/cuentos/costa/1.png",  emoji: "🌊" },
      { nombre: "Vicuñita Vicky", img: "/cuentos/sierra/1.png", emoji: "⛰️" },
      { nombre: "Monito Tito",    img: "/cuentos/selva/1.png",  emoji: "🌿" },
    ],
  },
  {
    texto: "¿Quién vive en las montañas donde hace mucho frío?",
    correcta: 1,
    opciones: [
      { nombre: "Pelícano Pepe",  img: "/cuentos/costa/1.png",  emoji: "🌊" },
      { nombre: "Vicuñita Vicky", img: "/cuentos/sierra/1.png", emoji: "⛰️" },
      { nombre: "Monito Tito",    img: "/cuentos/selva/1.png",  emoji: "🌿" },
    ],
  },
  {
    texto: "¿Quién vive en el árbol gigante de la selva verde?",
    correcta: 2,
    opciones: [
      { nombre: "Pelícano Pepe",  img: "/cuentos/costa/1.png",  emoji: "🌊" },
      { nombre: "Vicuñita Vicky", img: "/cuentos/sierra/1.png", emoji: "⛰️" },
      { nombre: "Monito Tito",    img: "/cuentos/selva/1.png",  emoji: "🌿" },
    ],
  },
];



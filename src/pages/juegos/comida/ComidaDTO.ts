
export const SCORE_MSG = ["¡Sigue practicando!", "¡Buen intento!", "¡Muy bien!", "¡Perfecto!"];

export type Phase = "intro" | "playing" | "result";

export interface Opcion {
  label: string;
  emoji: string;
  imagen?: string;
}

export interface Pregunta {
  region: string;
  pregunta: string;
  opciones: Opcion[];
  correcto: number;
  feedback: string;
}

export const PREGUNTAS: Pregunta[] = [
  {
    region: "🌊 Costa",
    pregunta:
      "¿Qué plato típico de la costa peruana se prepara con pescado fresco marinado en limón y ají?",
    opciones: [
      { label: "Ceviche",    emoji: "🐟" },
      { label: "Pachamanca", emoji: "🍖" },
      { label: "Juane",      emoji: "🌿" },
    ],
    correcto: 0,
    feedback:
      "¡Correcto! El ceviche es el plato estrella de la costa, preparado con limón, ají limo y cebolla morada.",
  },
  {
    region: "⛰️ Sierra",
    pregunta:
      "¿Cuál es el plato andino que se cocina bajo tierra con piedras calientes?",
    opciones: [
      { label: "Sudado de mero", emoji: "🫕" },
      { label: "Pachamanca",     emoji: "🪨" },
      { label: "Tacacho",        emoji: "🍌" },
    ],
    correcto: 1,
    feedback:
      "¡Así es! La pachamanca es un plato ceremonial de la sierra, cocinado bajo tierra con piedras volcánicas.",
  },
  {
    region: "🌿 Selva",
    pregunta:
      "¿Qué plato típico de la selva peruana es un tamal relleno envuelto en hojas de bijao?",
    opciones: [
      { label: "Causa limeña",     emoji: "🥔" },
      { label: "Adobo arequipeño", emoji: "🍲" },
      { label: "Juane",            emoji: "🍃" },
    ],
    correcto: 2,
    feedback:
      "¡Excelente! El juane es el plato bandera de la selva: arroz con pollo envuelto en hoja de bijao.",
  },
];

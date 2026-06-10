export const SCORE_MSG = [
  "¡Sigue practicando!",
  "¡Buen intento!",
  "¡Muy bien!",
  "¡Perfecto!",
];

export type Phase = "intro" | "playing" | "result";

export interface Opcion {
  label: string;
  emoji: string;
}

export interface Fase {
  region: string;
  regionLabel: string;
  pregunta: string;
  opciones: Opcion[];
  correcto: number;
  feedback: string;
}

export const FASES: Fase[] = [
  {
    region: "costa",
    regionLabel: "🌊 Costa",
    pregunta: "¿Qué animal es representativo de la Costa peruana?",
    opciones: [
      { label: "Pelícano",  emoji: "🦅" },
      { label: "Vicuña",    emoji: "🦙" },
      { label: "Jaguar",    emoji: "🐆" },
    ],
    correcto: 0,
    feedback: "¡El pelícano vuela sobre el mar peruano y es símbolo de la costa!",
  },
  {
    region: "sierra",
    regionLabel: "⛰️ Sierra",
    pregunta: "¿Qué animal vive en los Andes y nos da lana muy fina?",
    opciones: [
      { label: "Delfín",  emoji: "🐬" },
      { label: "Vicuña",  emoji: "🦙" },
      { label: "Guacamayo", emoji: "🦜" },
    ],
    correcto: 1,
    feedback: "¡La vicuña habita en las alturas andinas y su lana es la más fina del mundo!",
  },
  {
    region: "selva",
    regionLabel: "🌿 Selva",
    pregunta: "¿Qué colorido animal vuela por la Amazonía peruana?",
    opciones: [
      { label: "Cóndor",    emoji: "🦅" },
      { label: "Pingüino",  emoji: "🐧" },
      { label: "Guacamayo", emoji: "🦜" },
    ],
    correcto: 2,
    feedback: "¡El guacamayo es el rey de los colores en la selva amazónica!",
  },
];
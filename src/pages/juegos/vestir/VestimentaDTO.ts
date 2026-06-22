export type Categoria = "CABEZA" | "TORSO" | "PIERNAS" | "CALZADO";
export type TonoPiel  = "CLARO" | "MORENO" | "OSCURO";
export type RegionJuego = "COSTA" | "SIERRA" | "SELVA";

export const CATEGORIAS: { key: Categoria; label: string; icon: string }[] = [
  { key: "CABEZA",  label: "Cabeza",  icon: "🎩" },
  { key: "TORSO",   label: "Torso",   icon: "👕" },
  { key: "PIERNAS", label: "Piernas", icon: "👖" },
  { key: "CALZADO", label: "Calzado", icon: "👞" },
];

export const TONOS: { key: TonoPiel; label: string; color: string }[] = [
  { key: "CLARO",  label: "Claro",  color: "#F2C49B" },
  { key: "MORENO", label: "Moreno", color: "#B5713A" },
  { key: "OSCURO", label: "Oscuro", color: "#5C3317" },
];

export const REGIONES_JUEGO: {
  key: RegionJuego;
  label: string;
  emoji: string;
  descripcion: string;
  colorBadge: string;
}[] = [
  {
    key: "COSTA",
    label: "Costa",
    emoji: "🌊",
    descripcion: "Viste al avatar con ropa típica de la Costa peruana",
    colorBadge: "#1e88e5",
  },
  {
    key: "SIERRA",
    label: "Sierra",
    emoji: "⛰️",
    descripcion: "Ahora viste al avatar con ropa típica de la Sierra",
    colorBadge: "#7b5ea7",
  },
  {
    key: "SELVA",
    label: "Selva",
    emoji: "🌿",
    descripcion: "Por último, viste al avatar con ropa típica de la Selva",
    colorBadge: "#388e3c",
  },
];

export const SCORE_MSG = [
  "¡Sigue practicando! Aún puedes aprender más sobre las regiones.",
  "¡Buen intento! Conoces algunas tradiciones del Perú.",
  "¡Muy bien! Sabes bastante sobre las vestimentas peruanas.",
  "¡Perfecto! Eres un experto en trajes típicos del Perú. 🎉",
];

export type Phase = "intro" | "playing" | "result" | "libre";
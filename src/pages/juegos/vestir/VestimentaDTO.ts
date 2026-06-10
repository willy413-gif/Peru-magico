export type Categoria = "CABEZA" | "TORSO" | "PIERNAS" | "CALZADO" | "ACCESORIO";
export type TonoPiel = "CLARO" | "MORENO" | "OSCURO";

 export const CATEGORIAS: { key: Categoria; label: string; icon: string }[] = [
  { key: "CABEZA",    label: "Cabeza",     icon: "🎩" },
  { key: "TORSO",     label: "Torso",      icon: "👕" },
  { key: "PIERNAS",   label: "Piernas",    icon: "👖" },
  { key: "CALZADO",   label: "Calzado",    icon: "👞" },
];

export const TONOS: { key: TonoPiel; label: string; color: string }[] = [
  { key: "CLARO",  label: "Claro",  color: "#F2C49B" },
  { key: "MORENO", label: "Moreno", color: "#B5713A" },
  { key: "OSCURO", label: "Oscuro", color: "#5C3317" },
];
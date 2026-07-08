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



export interface VestimentaDto {
  id: number;
  nombre: string;
  region: RegionJuego;
  categoria: Categoria;
  imagen_url: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  pos_x: number;
  pos_y: number;
  escala: number;
  z_index: number;
}

export const vestimentas: VestimentaDto[] = [

   {
    id: 10,
    nombre: "polo",
    region: "COSTA",
    categoria: "TORSO",
    imagen_url: "/vestir/costa/costa-torso.png",
    descripcion: "polo costa",
    activo: true,
    created_at: "2026-06-08 21:49:41.02159",
    pos_x: -8,
    pos_y: -64,
    escala: 0.45,
    z_index: 10
  },
  {
    id: 11,
    nombre: "gorro",
    region: "COSTA",
    categoria: "CABEZA",
    imagen_url: "/vestir/costa/costa-cabeza.png",
    descripcion: "gorro costa",
    activo: true,
    created_at: "2026-06-08 22:01:45.392733",
    pos_x: -4,
    pos_y: -148,
    escala: 0.25,
    z_index: 2
  },
  {
    id: 12,
    nombre: "pantalón",
    region: "COSTA",
    categoria: "PIERNAS",
    imagen_url: "/vestir/costa/costa-piernas.png",
    descripcion: "shor pescador",
    activo: true,
    created_at: "2026-06-08 22:14:19.839893",
    pos_x: -2,
    pos_y: 7,
    escala: 0.45,
    z_index: 2
  },
  {
    id: 13,
    nombre: "Mocasines",
    region: "COSTA",
    categoria: "CALZADO",
    imagen_url: "/vestir/costa/costa-calzado.png",
    descripcion: "calzado pescador",
    activo: true,
    created_at: "2026-06-09 20:55:12.94507",
    pos_x: 0,
    pos_y: 0,
    escala: 1.0,
    z_index: 2
  },
  {
    id: 14,
    nombre: "Camisa andina",
    region: "SIERRA",
    categoria: "TORSO",
    imagen_url: "/vestir/sierra/sierra-torso.png",
    descripcion: "camisa andina",
    activo: true,
    created_at: "2026-06-09 23:29:54.075806",
    pos_x: 0,
    pos_y: 0,
    escala: 1.0,
    z_index: 10
  },
  {
    id: 15,
    nombre: "Pantalón Andino",
    region: "SIERRA",
    categoria: "PIERNAS",
    imagen_url: "/vestir/sierra/sierra-piernas.png",
    descripcion: "pantalon cosido a mano de lana",
    activo: true,
    created_at: "2026-06-09 23:39:17.011143",
    pos_x: 0,
    pos_y: 0,
    escala: 1.0,
    z_index: 5
  },
  {
    id: 16,
    nombre: "chullo",
    region: "SIERRA",
    categoria: "CABEZA",
    imagen_url: "/vestir/sierra/sierra-cabeza.png",
    descripcion: "gorro tradicional peruano",
    activo: true,
    created_at: "2026-06-10 03:20:03.44904",
    pos_x: -1,
    pos_y: 2,
    escala: 1.0,
    z_index: 15
  },
  {
    id: 17,
    nombre: "Botines Andinos",
    region: "SIERRA",
    categoria: "CALZADO",
    imagen_url: "/vestir/sierra/sierra-calzado.png",
    descripcion: "común en la sierra para lluvias",
    activo: true,
    created_at: "2026-06-10 03:52:08.156091",
    pos_x: -3,
    pos_y: 124,
    escala: 0.60,
    z_index: 5,
  },
  {
    id: 18,
    nombre: "Corona de Plumas",
    region: "SELVA",
    categoria: "CABEZA",
    imagen_url: "/vestir/selva/selva-cabeza.png",
    descripcion: "se lleva en la cabeza para recordar a sus ancestros",
    activo: true,
    created_at: "2026-06-10 04:00:58.807806",
    pos_x: -4,
    pos_y: -140,
    escala: 0.25,
    z_index: 5
  },
  {
    id: 19,
    nombre: "chaleco amazonico",
    region: "SELVA",
    categoria: "TORSO",
    imagen_url: "/vestir/selva/selva-torso.png",
    descripcion: null,
    activo: true,
    created_at: "2026-06-10 20:48:27.895657",
    pos_x: -6,
    pos_y: -54,
    escala: 0.45,
    z_index: 10
  },
  {
    id: 19,
    nombre: "falda de fibras",
    region: "SELVA",
    categoria: "PIERNAS",
    imagen_url: "/vestir/selva/selva-piernas.png",
    descripcion: "falda de fibras prenda tradicional de la selva peruana",
    activo: true,
    created_at: "2026-06-10 21:34:38.406444",
    pos_x: -4,
    pos_y: 18,
    escala: 0.50,
    z_index: 2
  },
  {
  id: 20,
    nombre: "botines amazónicos",
    region: "SELVA",
    categoria: "CALZADO",
    imagen_url: "/vestir/selva/selva-calzado.png",
    descripcion: "botas de fibras",
    activo: true,
    created_at: "2026-06-10 22:02:53.920549",
    pos_x: -2,
    pos_y: 125,
    escala: 0.55,
    z_index: 4
  },
]
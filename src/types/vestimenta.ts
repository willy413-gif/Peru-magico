export type Region =
  | "COSTA"
  | "SIERRA"
  | "SELVA";

export type Categoria =
  | "TORSO"
  | "PIERNAS"
  | "CALZADO"
  | "ACCESORIO";

export interface Vestimenta {
  id: number;
  nombre: string;
  region: Region;
  categoria: Categoria;
  imagen_url: string;
  descripcion?: string;
}
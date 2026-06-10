import { supabase } from "../../services/supabase";
import type { Cuento } from "./CuentoDto";

export async function obtenerCuentos(): Promise<Cuento[]> {

  const { data, error } = await supabase
    .from("cuentos")
    .select("*")
    .order("orden");

  if (error) {
    throw error;
  }

  return data as Cuento[];
}
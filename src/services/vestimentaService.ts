import { supabase } from "./supabase";

export async function obtenerVestimentas() {
  const { data, error } = await supabase
    .from("vestimentas")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
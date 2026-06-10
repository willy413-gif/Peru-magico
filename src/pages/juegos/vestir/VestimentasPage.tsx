/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import "./VestimentasPage.css";
import { useBot } from "../../../bot/BotContext";
import { CATEGORIAS, TONOS, type Categoria, type TonoPiel } from "./VestimentaDTO";
import { MENSAJES_SECCIONES } from "../../../bot/BotMensajes";


function VestimentasPage() {
  const { hablar } = useBot();

  const [categoria, setCategoria]               = useState<Categoria>("TORSO");
  const [tonoPiel, setTonoPiel]                 = useState<TonoPiel>("MORENO");
  const [vestimentas, setVestimentas]           = useState<any[]>([]);
  const [prendasEquipadas, setPrendasEquipadas] = useState<any[]>([]);

  useEffect(() => {
    hablar(MENSAJES_SECCIONES.JUEGO_VESTIMENTAS);
  }, []);

  useEffect(() => {
    async function cargarVestimentas() {
      const { data, error } = await supabase
        .from("vestimentas")
        .select("*")
        .eq("categoria", categoria);
      if (error) { console.error(error); return; }
      setVestimentas(data || []);
    }
    cargarVestimentas();
  }, [categoria]);

  const obtenerAvatar = () => {
    switch (tonoPiel) {
      case "CLARO":  return "/avatar/avatar_h_b.png";
      case "OSCURO": return "/avatar/avatar_h_n.png";
      default:       return "/avatar/avatar_h_m.png";
    }
  };

  const equiparPrenda = (nuevaPrenda: any) => {
    setPrendasEquipadas(prev => {
      const filtradas = prev.filter(p => p.categoria !== nuevaPrenda.categoria);
      return [...filtradas, nuevaPrenda].sort((a, b) => (a.z_index || 0) - (b.z_index || 0));
    });
  };

  const quitarPrenda = (id: number) =>
    setPrendasEquipadas(prev => prev.filter(p => p.id !== id));

  const estaEquipada = (id: number) => prendasEquipadas.some(p => p.id === id);

  return (
    <div className="vp-root">

      {/* ── SIDEBAR IZQUIERDO — solo categorías + outfit ── */}
      <aside className="vp-sidebar">
        <div className="vp-sidebar-header">
          <span className="vp-sidebar-eyebrow">Personalizar</span>
          <h2 className="vp-sidebar-title">Partes del cuerpo</h2>
        </div>

        <nav className="vp-cat-list">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.key}
              className={`vp-cat-btn${categoria === cat.key ? " vp-cat-btn--active" : ""}`}
              onClick={() => setCategoria(cat.key)}
            >
              <span className="vp-cat-icon">{cat.icon}</span>
              <span className="vp-cat-label">{cat.label}</span>
              {categoria === cat.key && <span className="vp-cat-dot" />}
            </button>
          ))}
        </nav>

        {/* Outfit actual */}
        {prendasEquipadas.length > 0 && (
          <div className="vp-equipped">
            <span className="vp-equipped-label">Outfit actual</span>
            <ul className="vp-equipped-list">
              {prendasEquipadas.map(p => (
                <li key={p.id} className="vp-equipped-item">
                  <span className="vp-equipped-name">{p.nombre}</span>
                  <button
                    className="vp-equipped-remove"
                    onClick={() => quitarPrenda(p.id)}
                    aria-label={`Quitar ${p.nombre}`}
                  >✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* ── CENTRO — Avatar grande + selector de piel abajo ── */}
      <main className="vp-center">
        <div className="vp-avatar-card">
          <div className="vp-avatar-glow" />

          <div className="vp-avatar-frame">
            <img src={obtenerAvatar()} alt="Avatar base" className="vp-avatar-base" />
            {prendasEquipadas.map(prenda => (
              <div
                key={prenda.id}
                className="vp-avatar-layer"
                style={{
                  transform: `translate(${prenda.pos_x || 0}px, ${prenda.pos_y || 0}px)`,
                  zIndex: prenda.z_index,
                }}
              >
                <img
                  src={prenda.imagen_url}
                  alt={prenda.nombre}
                  style={{ transform: `scale(${prenda.escala || 1})` }}
                />
              </div>
            ))}
          </div>

          {/* ── Selector de piel DEBAJO del avatar ── */}
          <div className="vp-skin-picker">
            <span className="vp-skin-picker-label">Color de piel</span>
            <div className="vp-skin-picker-btns">
              {TONOS.map(t => (
                <button
                  key={t.key}
                  className={`vp-skin-circle${tonoPiel === t.key ? " vp-skin-circle--active" : ""}`}
                  onClick={() => setTonoPiel(t.key)}
                  title={t.label}
                >
                  <span className="vp-skin-circle-dot" style={{ background: t.color }} />
                  <span className="vp-skin-circle-name">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="vp-avatar-hint">
            {prendasEquipadas.length === 0
              ? "Selecciona prendas para vestir a tu personaje"
              : `${prendasEquipadas.length} prenda${prendasEquipadas.length > 1 ? "s" : ""} equipada${prendasEquipadas.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </main>

      {/* ── CATÁLOGO DERECHO ── */}
      <aside className="vp-catalog">
        <div className="vp-catalog-header">
          <span className="vp-catalog-eyebrow">
            {CATEGORIAS.find(c => c.key === categoria)?.icon}{" "}
            {CATEGORIAS.find(c => c.key === categoria)?.label}
          </span>
          <h2 className="vp-catalog-title">Prendas disponibles</h2>
          {vestimentas.length > 0 && (
            <span className="vp-catalog-count">{vestimentas.length} prendas</span>
          )}
        </div>

        {vestimentas.length === 0 ? (
          <div className="vp-empty">
            <span className="vp-empty-icon">🪡</span>
            <p>No hay prendas en esta categoría</p>
          </div>
        ) : (
          <div className="vp-grid">
            {vestimentas.map(prenda => {
              const equipada = estaEquipada(prenda.id);
              return (
                <button
                  key={prenda.id}
                  className={`vp-card${equipada ? " vp-card--on" : ""}`}
                  onClick={() => equiparPrenda(prenda)}
                  title={prenda.nombre}
                >
                  <div className="vp-card-img-wrap">
                    <img src={prenda.imagen_url} alt={prenda.nombre} className="vp-card-img" />
                    {equipada && <span className="vp-card-badge">✓</span>}
                  </div>
                  <span className="vp-card-name">{prenda.nombre}</span>
                  {prenda.region && (
                    <span className="vp-card-region">{prenda.region}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
}

export default VestimentasPage;
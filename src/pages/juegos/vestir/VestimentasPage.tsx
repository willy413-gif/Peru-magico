/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabase";
import "./VestimentasPage.css";
import { useBot } from "../../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../../bot/BotMensajes";
import {
  CATEGORIAS, TONOS, REGIONES_JUEGO, SCORE_MSG,
  type Categoria, type TonoPiel, type Phase,
} from "./VestimentaDTO";

const CATEGORIAS_KEYS: Categoria[] = ["CABEZA", "TORSO", "PIERNAS", "CALZADO"];

function VestimentasPage() {
  const { hablar } = useBot();
  const navigate   = useNavigate();

  const [phase,    setPhase]    = useState<Phase>("intro");
  const [tonoPiel, setTonoPiel] = useState<TonoPiel>("MORENO");

  const [regionIdx,          setRegionIdx]          = useState(0);
  const [categoria,          setCategoria]          = useState<Categoria>("CABEZA");
  const [vestimentas,        setVestimentas]        = useState<any[]>([]);
  const [prendasEquipadas,   setPrendasEquipadas]   = useState<any[]>([]);
  const [regionesCorrectas,  setRegionesCorrectas]  = useState<boolean[]>([]);
  const [litStars,           setLitStars]           = useState([false, false, false]);
  const [confirmar,          setConfirmar]          = useState(false);

  /* prendas elegidas en la región actual — para evaluar al finalizar */
  const [prendasRegion, setPrendasRegion] = useState<any[]>([]);

  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introSpoken = useRef(false);

  const regionActual = REGIONES_JUEGO[regionIdx];

  /* ── Intro ── */
  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;
    hablar(
      MENSAJES_SECCIONES.JUEGO_VESTIMENTAS,
      "es-PE",
      () => {
        setPhase("playing");
        hablar(`Viste al avatar con ropa típica de la ${REGIONES_JUEGO[0].label}. Empieza por la Cabeza.`, "es-PE");
      },
    );
  }, []);

  /* ── Cargar prendas al cambiar categoría ── */
  useEffect(() => {
    if (phase !== "playing" && phase !== "libre") return;
    supabase.from("vestimentas").select("*").eq("categoria", categoria)
      .then(({ data }) => setVestimentas(data || []));
  }, [categoria, phase]);

  const mostrarToast = useCallback((msg: string, tipo: "ok" | "err") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, tipo });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
    // Quitar emojis antes de hablar
    const textoHablado = msg.replace(/[✅❌]/g, "").trim();
    hablar(textoHablado, "es-PE");
  }, [hablar]);

  /* ── Equipar prenda — sin bloqueos, cualquier prenda es elegible ── */
  const equiparPrenda = (prenda: any) => {
    // Reemplaza la prenda de esa categoría
    setPrendasEquipadas(prev => {
      const filtradas = prev.filter((p: any) => p.categoria !== prenda.categoria);
      return [...filtradas, prenda].sort((a, b) => (a.z_index || 0) - (b.z_index || 0));
    });

    // Registra en las prendas de esta región (una por categoría)
    setPrendasRegion(prev => {
      const filtradas = prev.filter((p: any) => p.categoria !== prenda.categoria);
      return [...filtradas, prenda];
    });

    // Feedback dinámico con nombre y región de la prenda
    if (phase === "playing") {
      const regionPrenda   = (prenda.region || "").toUpperCase();
      const regionEsperada = regionActual.key;
      if (regionPrenda && regionPrenda !== regionEsperada) {
        mostrarToast(`"${prenda.nombre}" es de la ${prenda.region} — pero puede servir 🤔`, "err");
      } else if (regionPrenda === regionEsperada) {
        mostrarToast(`✅ "${prenda.nombre}" es típico de la ${regionActual.label}`, "ok");
      } else {
        mostrarToast(`"${prenda.nombre}" seleccionado`, "ok");
      }
    }
  };

  const quitarPrenda = (id: number) => {
    setPrendasEquipadas(prev => prev.filter((p: any) => p.id !== id));
    setPrendasRegion(prev => prev.filter((p: any) => p.id !== id));
  };

  /* ── Confirmar región completada ── */
  const solicitarConfirmar = () => {
    setConfirmar(true);
    hablar(`¿Listo con la ${regionActual.label}? Confirma para continuar.`, "es-PE");
  };

  const avanzarRegion = () => {
    setConfirmar(false);

    // Evaluar: ¿todas las prendas elegidas son de la región correcta?
    const todasCorrectas = prendasRegion.length === CATEGORIAS_KEYS.length &&
      prendasRegion.every(p => (p.region || "").toUpperCase() === regionActual.key);

    const nuevasCorrectas = [...regionesCorrectas, todasCorrectas];
    setRegionesCorrectas(nuevasCorrectas);

    const nextIdx = regionIdx + 1;
    if (nextIdx >= REGIONES_JUEGO.length) {
      finalizarJuego(nuevasCorrectas);
    } else {
      setRegionIdx(nextIdx);
      setCategoria(CATEGORIAS_KEYS[0]);
      setPrendasEquipadas([]);
      setPrendasRegion([]);
      hablar(
        `Ahora viste al avatar con ropa de la ${REGIONES_JUEGO[nextIdx].label}. Empieza por la Cabeza.`,
        "es-PE",
      );
    }
  };

  const finalizarJuego = (correctas: boolean[]) => {
    const score = correctas.filter(Boolean).length;
    setPhase("result");
    hablar(`${SCORE_MSG[score]}. Vestiste bien ${score} de ${REGIONES_JUEGO.length} regiones.`);
    for (let i = 0; i < score; i++) {
      setTimeout(() => {
        setLitStars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 350 + i * 280);
    }
  };

  const reiniciar = () => {
    setPhase("playing");
    setRegionIdx(0);
    setCategoria(CATEGORIAS_KEYS[0]);
    setPrendasEquipadas([]);
    setPrendasRegion([]);
    setRegionesCorrectas([]);
    setLitStars([false, false, false]);
    hablar(`Viste al avatar con ropa de la ${REGIONES_JUEGO[0].label}. Empieza por la Cabeza.`, "es-PE");
  };

  const modoLibre = () => {
    setPhase("libre");
    setCategoria("CABEZA");
    setPrendasEquipadas([]);
    setPrendasRegion([]);
    hablar("¡Modo libre! Viste al avatar como quieras.");
  };

  const estaEquipada = (id: number) => prendasEquipadas.some((p: any) => p.id === id);

  const obtenerAvatar = () => {
    switch (tonoPiel) {
      case "CLARO":  return "/avatar/avatar_h_b.png";
      case "OSCURO": return "/avatar/avatar_h_n.png";
      default:       return "/avatar/avatar_h_m.png";
    }
  };

  return (
    <div className="vp-root">

      {/* ════ SIDEBAR ════ */}
      <aside className="vp-sidebar">
        <div className="vp-sidebar-header">
          <span className="vp-sidebar-eyebrow">
            {phase === "libre" ? "Modo libre" : regionActual?.label}
          </span>
          <h2 className="vp-sidebar-title">Partes del cuerpo</h2>
        </div>

        <nav className="vp-cat-list">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.key}
              className={[
                "vp-cat-btn",
                categoria === cat.key ? "vp-cat-btn--active" : "",
              ].join(" ")}
              onClick={() => setCategoria(cat.key)}
            >
              <span className="vp-cat-icon">{cat.icon}</span>
              <span className="vp-cat-label">{cat.label}</span>
              {categoria === cat.key && <span className="vp-cat-dot" />}
            </button>
          ))}
        </nav>

        {prendasEquipadas.length > 0 && (
          <div className="vp-equipped">
            <span className="vp-equipped-label">Outfit actual</span>
            <ul className="vp-equipped-list">
              {prendasEquipadas.map((p: any) => (
                <li key={p.id} className="vp-equipped-item">
                  <span className="vp-equipped-name">{p.nombre}</span>
                  <button className="vp-equipped-remove" onClick={() => quitarPrenda(p.id)} aria-label={`Quitar ${p.nombre}`}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* ════ CENTRO ════ */}
      <main className="vp-center">

        {/* Badge región — solo letras, sin descripción ni icono */}
        {phase === "playing" && (
          <div className="vp-region-badge">
            <span className="vp-region-badge__titulo">{regionActual.label}</span>
          </div>
        )}
        {phase === "libre" && (
          <div className="vp-region-badge">
            <span className="vp-region-badge__titulo">Modo libre</span>
          </div>
        )}

        {/* Botón volver — flotante dentro del centro */}
        <button className="vp-btn-menu" onClick={() => navigate("/menu-juegos")}>
          ← Menú
        </button>

        <div className="vp-avatar-card">
          <div className="vp-avatar-glow" />
          <div className="vp-avatar-frame">
            <img src={obtenerAvatar()} alt="Avatar base" className="vp-avatar-base" />
            {prendasEquipadas.map((prenda: any) => (
              <div
                key={prenda.id}
                className="vp-avatar-layer"
                style={{
                  transform: `translate(${prenda.pos_x || 0}px, ${prenda.pos_y || 0}px)`,
                  zIndex: prenda.z_index,
                }}
              >
                <img src={prenda.imagen_url} alt={prenda.nombre} style={{ transform: `scale(${prenda.escala || 1})` }} />
              </div>
            ))}
          </div>

          <div className="vp-skin-picker">
            <span className="vp-skin-picker-label">Color de piel</span>
            <div className="vp-skin-picker-btns">
              {TONOS.map(t => (
                <button
                  key={t.key}
                  className={`vp-skin-circle${tonoPiel === t.key ? " vp-skin-circle--active" : ""}`}
                  onClick={() => setTonoPiel(t.key)}
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

          {/* Botón confirmar región — solo en modo juego */}
          {phase === "playing" && (
            <button className="vp-btn-confirmar" onClick={solicitarConfirmar}>
              {regionIdx < REGIONES_JUEGO.length - 1
                ? `Listo con ${regionActual.label} →`
                : "¡Terminar juego!"}
            </button>
          )}
        </div>
      </main>

      {/* ════ CATÁLOGO ════ */}
      <aside className="vp-catalog">
        <div className="vp-catalog-header">
          <span className="vp-catalog-eyebrow">
            {CATEGORIAS.find(c => c.key === categoria)?.icon}{" "}
            {CATEGORIAS.find(c => c.key === categoria)?.label}
          </span>
          <h2 className="vp-catalog-title">Prendas disponibles</h2>
          {vestimentas.length > 0 && <span className="vp-catalog-count">{vestimentas.length} prendas</span>}
        </div>

        {vestimentas.length === 0 ? (
          <div className="vp-empty">
            <span className="vp-empty-icon">🪡</span>
            <p>No hay prendas en esta categoría</p>
          </div>
        ) : (
          <div className="vp-grid">
            {vestimentas.map((prenda: any) => {
              const equipada = estaEquipada(prenda.id);
              return (
                <button
                  key={prenda.id}
                  className={["vp-card", equipada ? "vp-card--on" : ""].join(" ")}
                  onClick={() => equiparPrenda(prenda)}
                  title={prenda.nombre}
                >
                  <div className="vp-card-img-wrap">
                    <img src={prenda.imagen_url} alt={prenda.nombre} className="vp-card-img" />
                    {equipada && <span className="vp-card-badge">✓</span>}
                  </div>
                  <span className="vp-card-name">{prenda.nombre}</span>
                  {prenda.region && <span className="vp-card-region">{prenda.region}</span>}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* ── Toast ── */}
      {toast && <div className={`vp-toast vp-toast--${toast.tipo}`}>{toast.msg}</div>}

      {/* ── Confirmar avanzar región ── */}
      {confirmar && (
        <div className="vp-confirmar-overlay">
          <div className="vp-confirmar-card">
            <h3>{regionActual.label} completada</h3>
            <p>
              {regionIdx < REGIONES_JUEGO.length - 1
                ? `¿Pasamos a la ${REGIONES_JUEGO[regionIdx + 1].label}?`
                : "¿Listo para ver tus resultados?"}
            </p>
            <div className="vp-confirmar-btns">
              <button className="vp-confirmar-btn vp-confirmar-btn--cancel" onClick={() => setConfirmar(false)}>
                Seguir eligiendo
              </button>
              <button className="vp-confirmar-btn vp-confirmar-btn--ok" onClick={avanzarRegion}>
                {regionIdx < REGIONES_JUEGO.length - 1
                  ? `Siguiente: ${REGIONES_JUEGO[regionIdx + 1].label}`
                  : "¡Ver resultados!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resultado final ── */}
      {phase === "result" && (
        <div className="vp-result-overlay">
          <div className="vp-result-card">
            <p className="vp-result-title">¡Juego terminado!</p>
            <p className="vp-result-sub">Regiones vestidas correctamente</p>
            <div className="vp-result-stars">
              {REGIONES_JUEGO.map((_, i) => (
                <span key={i} className={`vp-result-star${litStars[i] ? " vp-result-star--lit" : ""}`}>★</span>
              ))}
            </div>
            <p className="vp-result-score">{regionesCorrectas.filter(Boolean).length} / {REGIONES_JUEGO.length}</p>
            <p className="vp-result-msg">{SCORE_MSG[regionesCorrectas.filter(Boolean).length]}</p>
            <div className="vp-result-btns">
              <button className="vp-result-btn vp-result-btn--primary" onClick={reiniciar}>Jugar de nuevo</button>
              <button className="vp-result-btn vp-result-btn--secondary" onClick={modoLibre}>Modo libre</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VestimentasPage;
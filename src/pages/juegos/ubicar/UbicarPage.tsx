/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UbicarPage.css";
import { useBot } from "../../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../../bot/BotMensajes";
import { FASES, SCORE_MSG, type Phase } from "./UbicarDTO";

/* Detecta si el dispositivo es táctil (sin mouse fino).
   En táctil usamos SOLO tap-to-place; en desktop SOLO drag.
   Mezclar ambos en el mismo elemento causa conflictos donde
   el navegador no resuelve bien si es un "drag" o un "tap". */
function useEsTactil() {
  const [esTactil, setEsTactil] = useState(false);
  useEffect(() => {
    const tactil = window.matchMedia("(pointer: coarse)").matches
      || ("ontouchstart" in window);
    setEsTactil(tactil);
  }, []);
  return esTactil;
}

function UbicarPage() {
  const { hablar }   = useBot();
  const navigate     = useNavigate();
  const esTactil     = useEsTactil();

  const [phase,      setPhase]      = useState<Phase>("intro");
  const [faseIdx,    setFaseIdx]    = useState(0);
  const [score,      setScore]      = useState(0);

  const [dragging,    setDragging]    = useState<number | null>(null); // drag desktop
  const [seleccionado, setSeleccionado] = useState<number | null>(null); // tap móvil
  const [hoverDrop,   setHoverDrop]   = useState(false);
  const [colocado,    setColocado]    = useState<number | null>(null);
  const [flashTipo,   setFlashTipo]   = useState<"correcto" | "error" | null>(null);
  const [feedback,    setFeedback]    = useState("");
  const [litStars,    setLitStars]    = useState([false, false, false]);
  const introSpoken   = useRef(false);

  const fase = FASES[faseIdx];

  /* ── Intro ── */
  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;
    hablar(
      MENSAJES_SECCIONES.JUEGO_UBICAR,
      "es-PE",
      () => {
        setPhase("playing");
        hablar(fase.pregunta);
      },
    );
  }, []);

  /* ── Bloquear scroll ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* ── Lógica común al soltar/confirmar un animal en la zona ── */
  const resolverColocacion = (idx: number) => {
    if (colocado !== null) return;

    const esCorrecta = idx === fase.correcto;
    const newScore    = esCorrecta ? score + 1 : score;

    setColocado(idx);
    setFlashTipo(esCorrecta ? "correcto" : "error");
    if (esCorrecta) setScore(newScore);

    const msg = esCorrecta ? `¡Correcto! ${fase.feedback}` : "Incorrecto. ¡Sigue intentando!";
    setFeedback(msg);

    hablar(msg, "es-PE", () => {
      setTimeout(() => {
        const next = faseIdx + 1;
        if (next >= FASES.length) {
          goToResult(newScore);
        } else {
          setFaseIdx(next);
          setColocado(null);
          setFlashTipo(null);
          setDragging(null);
          setSeleccionado(null);
          setFeedback("");
          hablar(FASES[next].pregunta);
        }
      }, 400);
    });

    setDragging(null);
    setSeleccionado(null);
    setTimeout(() => setFlashTipo(null), 600);
  };

  /* ── Drag handlers (desktop / mouse) ── */
  const onDragStart = (idx: number) => setDragging(idx);
  const onDragEnd   = () => { setDragging(null); setHoverDrop(false); };
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setHoverDrop(true); };
  const onDragLeave = () => setHoverDrop(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHoverDrop(false);
    if (dragging === null) return;
    resolverColocacion(dragging);
  };

  /* ── Tap handlers (móvil / táctil) ──
     1er tap en una tarjeta → la selecciona (se ilumina)
     2do tap en la zona de destino → coloca y resuelve
     tap de nuevo en la misma tarjeta → deselecciona
  ── */
  const onTapCard = (idx: number) => {
    if (colocado !== null) return;
    setSeleccionado(prev => (prev === idx ? null : idx));
  };

  const onTapDropZone = () => {
    if (colocado !== null || seleccionado === null) return;
    resolverColocacion(seleccionado);
  };

  /* ── Resultado ── */
  function goToResult(finalScore: number) {
    setPhase("result");
    hablar(`${SCORE_MSG[finalScore]}. Obtuviste ${finalScore} de ${FASES.length}.`);
    for (let i = 0; i < finalScore; i++) {
      setTimeout(() => {
        setLitStars(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 350 + i * 280);
    }
  }

  function handleReplay() {
    setPhase("intro");
    setFaseIdx(0);
    setScore(0);
    setColocado(null);
    setFlashTipo(null);
    setDragging(null);
    setSeleccionado(null);
    setFeedback("");
    setLitStars([false, false, false]);
    introSpoken.current = false;
    hablar(
      MENSAJES_SECCIONES.JUEGO_UBICAR,
      "es-PE",
      () => { setPhase("playing"); hablar(FASES[0].pregunta); },
    );
  }

  const dropClass = [
    "ubicar-drop-zone",
    (hoverDrop || seleccionado !== null) && colocado === null ? "hover-activo" : "",
    flashTipo === "correcto" ? "correcto-flash" : "",
    flashTipo === "error"    ? "error-flash"    : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="ubicar-wrap">
      <div className="ubicar-bg" />
      <div className="ubicar-overlay" />

      <div className="ubicar-content">

        <button
          className="ubicar-back-btn"
          onClick={() => navigate("/menu-juegos")}
          aria-label="Volver al menú"
        >←</button>

        {/* ── Intro ── */}
        {phase === "intro" && (
          <div className="ubicar-intro">
            <div className="ubicar-preloader">
              <span>🦙</span><span>🦅</span><span>🐆</span><span>🦜</span>
            </div>
            <p className="ubicar-intro__text">Cargando juego de animales…</p>
          </div>
        )}

        {/* ── Juego ── */}
        {phase === "playing" && (
          <>
            <div className="ubicar-dots">
              {FASES.map((_, i) => (
                <div key={i} className={[
                  "ubicar-dot",
                  i < faseIdx  ? "ubicar-dot--done"   : "",
                  i === faseIdx ? "ubicar-dot--active" : "",
                ].join(" ")} />
              ))}
            </div>

            <span className="ubicar-region-badge">{fase.regionLabel}</span>
            <p className="ubicar-question">{fase.pregunta}</p>

            {/* Zona de destino: drop (desktop) o tap (móvil) — nunca ambos a la vez */}
            <div
              className={dropClass}
              onDragOver={esTactil ? undefined : onDragOver}
              onDragLeave={esTactil ? undefined : onDragLeave}
              onDrop={esTactil ? undefined : onDrop}
              onClick={esTactil ? onTapDropZone : undefined}
            >
              {colocado !== null ? (
                <>
                  {fase.opciones[colocado].imagen ? (
                    <img
                      src={fase.opciones[colocado].imagen}
                      alt={fase.opciones[colocado].label}
                      className="ubicar-drop-image"
                    />
                  ) : (
                    <span className="ubicar-drop-emoji">{fase.opciones[colocado].emoji}</span>
                  )}
                  <span className="ubicar-drop-label">{fase.opciones[colocado].label}</span>
                </>
              ) : (
                <span className="ubicar-drop-hint">
                  {esTactil
                    ? (seleccionado !== null ? "Toca aquí para soltar" : "Toca un animal primero")
                    : "Arrastra un animal aquí"}
                </span>
              )}
            </div>

            {/* Opciones: drag (desktop) + tap (móvil) */}
            <div className="ubicar-options">
              {fase.opciones.map((op, i) => (
                <div
                  key={i}
                  className={[
                    "ubicar-card",
                    dragging === i     ? "dragging"     : "",
                    seleccionado === i ? "seleccionado" : "",
                    colocado === i     ? "usado"        : "",
                  ].join(" ")}
                  draggable={!esTactil && colocado === null}
                  onDragStart={esTactil ? undefined : () => onDragStart(i)}
                  onDragEnd={esTactil ? undefined : onDragEnd}
                  onClick={esTactil ? () => onTapCard(i) : undefined}
                  role="button"
                  tabIndex={0}
                  aria-label={`Elegir ${op.label}`}
                >
                  {op.imagen ? (
                    <img src={op.imagen} alt={op.label} className="ubicar-card__image" />
                  ) : (
                    <span className="ubicar-card__emoji">{op.emoji}</span>
                  )}
                  <span className="ubicar-card__label">{op.label}</span>
                  <span className="ubicar-card__hint-tap">
                    {seleccionado === i ? "Elegido ✓" : "Toca"}
                  </span>
                </div>
              ))}
            </div>

            {feedback && <p className="ubicar-feedback">{feedback}</p>}
          </>
        )}

        {/* ── Resultado flotante ── */}
        {phase === "result" && (
          <div className="ubicar-result-overlay">
            <div className="ubicar-result-card">
              <p className="ubicar-result-title">¡Juego terminado!</p>
              <p className="ubicar-result-sub">Tu puntaje en el juego de animales</p>

              <div className="ubicar-stars">
                {FASES.map((_, i) => (
                  <span key={i} className={["ubicar-star", litStars[i] ? "ubicar-star--lit" : ""].join(" ")}>★</span>
                ))}
              </div>

              <p className="ubicar-score-num">{score} / {FASES.length}</p>
              <p className="ubicar-score-msg">{SCORE_MSG[score]}</p>

              <button className="ubicar-replay-btn" onClick={handleReplay}>
                Jugar de nuevo
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UbicarPage;
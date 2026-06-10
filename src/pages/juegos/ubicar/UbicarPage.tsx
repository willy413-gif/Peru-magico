import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UbicarPage.css";
import { useBot } from "../../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../../bot/BotMensajes";
import { FASES, SCORE_MSG, type Phase } from "./UbicarDTO";

function UbicarPage() {
  const { hablar }   = useBot();
  const navigate     = useNavigate();

  const [phase,      setPhase]      = useState<Phase>("intro");
  const [faseIdx,    setFaseIdx]    = useState(0);
  const [score,      setScore]      = useState(0);
  const [dragging,   setDragging]   = useState<number | null>(null);
  const [hoverDrop,  setHoverDrop]  = useState(false);
  const [colocado,   setColocado]   = useState<number | null>(null);   // índice de opción colocada
  const [flashTipo,  setFlashTipo]  = useState<"correcto" | "error" | null>(null);
  const [feedback,   setFeedback]   = useState("");
  const [litStars,   setLitStars]   = useState([false, false, false]);
  const introSpoken  = useRef(false);

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

  /* ── Drag handlers ── */
  const onDragStart = (idx: number) => setDragging(idx);
  const onDragEnd   = () => { setDragging(null); setHoverDrop(false); };

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setHoverDrop(true); };
  const onDragLeave = () => setHoverDrop(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHoverDrop(false);
    if (dragging === null || colocado !== null) return;

    const esCorrecta = dragging === fase.correcto;
    const newScore   = esCorrecta ? score + 1 : score;

    setColocado(dragging);
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
          setFeedback("");
          hablar(FASES[next].pregunta);
        }
      }, 400);
    });

    setDragging(null);
    setTimeout(() => setFlashTipo(null), 600);
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
    hoverDrop && colocado === null ? "hover-activo" : "",
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
            {/* Puntos de progreso */}
            <div className="ubicar-dots">
              {FASES.map((_, i) => (
                <div key={i} className={[
                  "ubicar-dot",
                  i < faseIdx  ? "ubicar-dot--done"   : "",
                  i === faseIdx ? "ubicar-dot--active" : "",
                ].join(" ")} />
              ))}
            </div>

            {/* Badge región */}
            <span className="ubicar-region-badge">{fase.regionLabel}</span>

            {/* Pregunta */}
            <p className="ubicar-question">{fase.pregunta}</p>

            {/* Zona de drop */}
            <div
              className={dropClass}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {colocado !== null ? (
                <>
                  <span className="ubicar-drop-emoji">{fase.opciones[colocado].emoji}</span>
                  <span className="ubicar-drop-label">{fase.opciones[colocado].label}</span>
                </>
              ) : (
                <span className="ubicar-drop-hint">Suelta aquí</span>
              )}
            </div>

            {/* Opciones arrastrables */}
            <div className="ubicar-options">
              {fase.opciones.map((op, i) => (
                <div
                  key={i}
                  className={[
                    "ubicar-card",
                    dragging === i  ? "dragging" : "",
                    colocado === i  ? "usado"    : "",
                  ].join(" ")}
                  draggable={colocado === null}
                  onDragStart={() => onDragStart(i)}
                  onDragEnd={onDragEnd}
                >
                  <span className="ubicar-card__emoji">{op.emoji}</span>
                  <span className="ubicar-card__label">{op.label}</span>
                </div>
              ))}
            </div>

            {/* Feedback */}
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
                  <span key={i} className={["ubicar-star", litStars[i] ? "ubicar-star--lit" : ""].join(" ")}>
                    ★
                  </span>
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
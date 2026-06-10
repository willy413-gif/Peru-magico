import { useEffect, useRef, useState } from "react";
import { MENSAJES_SECCIONES } from "../../../bot/BotMensajes";
import { useBot } from "../../../bot/BotContext";
import "./ComidaPage.css";
import { PREGUNTAS, SCORE_MSG, type Phase } from "./ComidaDTO";
import { useNavigate } from "react-router-dom";

function ComidaPage() {
  const { hablar } = useBot();
  const [phase,    setPhase]    = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [score,    setScore]    = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [litStars, setLitStars] = useState([false, false, false]);
  const introSpoken = useRef(false);
  const navigate = useNavigate();

  /* ── Leer intro; al terminar arranca el juego ── */
  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;
    hablar(
      MENSAJES_SECCIONES.JUEGO_COMIDA,
      "es-PE",
      () => setPhase("playing"),
    );
  }, [phase]);

  /* ── Leer cada pregunta al cambiar de slide ── */
  useEffect(() => {
    if (phase !== "playing") return;
    hablar(PREGUNTAS[currentQ].pregunta);
  }, [phase, currentQ]);

  /* ── Bloquear scroll ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const q        = PREGUNTAS[currentQ];
  const answered = selected !== null;

  function handleSelect(idx: number) {
    if (answered) return;
    const isCorrect = idx === q.correcto;
    const newScore  = isCorrect ? score + 1 : score;
    setSelected(idx);
    if (isCorrect) setScore(newScore);

    // ✅ Correcto → lee feedback completo
    // ❌ Incorrecto → solo "Incorrecto." y avanza
    const feedbackMsg = isCorrect
      ? `¡Correcto! ${q.feedback}`
      : "Incorrecto.";

    hablar(
      feedbackMsg,
      "es-PE",
      () => {
        const nextQ = currentQ + 1;
        if (nextQ >= PREGUNTAS.length) {
          goToResult(newScore);
        } else {
          setCurrentQ(nextQ);
          setSelected(null);
        }
      },
    );
  }

  function goToResult(finalScore: number) {
    setPhase("result");
    hablar(
      `${SCORE_MSG[finalScore]}. Obtuviste ${finalScore} de ${PREGUNTAS.length}.`
    );
    for (let i = 0; i < finalScore; i++) {
      setTimeout(() => {
        setLitStars((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 350 + i * 280);
    }
  }

  function handleReplay() {
    setPhase("intro");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setLitStars([false, false, false]);
    introSpoken.current = false;
  }

  return (
    <div className="comida-wrap">
      <div className="comida-bg" />
      <div className="comida-overlay" />

      <div className="comida-content">

        <button
            className="comida-back-btn"
            onClick={() => navigate("/menu-juegos")}
            aria-label="Volver al menú"
            >
            ←
        </button>

        {/* ── Intro: preloader animado ── */}
        {phase === "intro" && (
          <div className="comida-intro">
            <div className="comida-preloader">
              <span>🍽️</span>
              <span>🌊</span>
              <span>⛰️</span>
              <span>🌿</span>
            </div>
            <p className="comida-intro__text">Cargando tour gastronómico…</p>
          </div>
        )}

        {/* ── Juego ── */}
        {phase === "playing" && (
          <>
            <div className="comida-dots">
              {PREGUNTAS.map((_, i) => (
                <div
                  key={i}
                  className={[
                    "comida-dot",
                    i < currentQ   ? "comida-dot--done"  : "",
                    i === currentQ ? "comida-dot--active" : "",
                  ].join(" ")}
                />
              ))}
            </div>

            <span className="comida-region-badge">{q.region}</span>
            <p className="comida-question">{q.pregunta}</p>

            <div className="comida-options">
              {q.opciones.map((op, i) => {
                const isCorrect = answered && i === q.correcto;
                const isWrong   = answered && i === selected && i !== q.correcto;
                return (
                  <button
                    key={i}
                    className={[
                      "comida-card",
                      isCorrect ? "comida-card--correct" : "",
                      isWrong   ? "comida-card--wrong"   : "",
                    ].join(" ")}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    aria-label={op.label}
                  >
                    {op.imagen ? (
                      <img src={op.imagen} alt={op.label} className="comida-card__img" />
                    ) : (
                      <span className="comida-card__emoji" aria-hidden="true">
                        {op.emoji}
                      </span>
                    )}
                    <span className="comida-card__label">{op.label}</span>
                    {isCorrect && <span className="comida-card__mark" aria-hidden="true">✅</span>}
                    {isWrong   && <span className="comida-card__mark" aria-hidden="true">❌</span>}
                  </button>
                );
              })}
            </div>

            {answered && (
              <p className="comida-feedback">
                {selected === q.correcto
                  ? `✅ ¡Correcto! ${q.feedback}`
                  : `❌ "${q.opciones[selected!].label}" no es la correcta. ${q.feedback}`}
              </p>
            )}
          </>
        )}

        {/* ── Resultado ── */}
        {phase === "result" && (
          <div className="comida-result-card">
            <p className="comida-result-title">¡Juego terminado!</p>
            <p className="comida-result-sub">Tu puntaje en el tour gastronómico</p>

            <div className="comida-stars">
              {PREGUNTAS.map((_, i) => (
                <span
                  key={i}
                  className={["comida-star", litStars[i] ? "comida-star--lit" : ""].join(" ")}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="comida-score-num">{score} / {PREGUNTAS.length}</p>
            <p className="comida-score-msg">{SCORE_MSG[score]}</p>

            <button className="comida-replay-btn" onClick={handleReplay}>
              Jugar de nuevo
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ComidaPage;
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Practicaprotagonistas.css";
import { PREGUNTAS, type Estado } from "./PracticaprotagonistaDTO";
import { useBot } from "../../../bot/BotContext";
import { narrar } from "../../../bot/BotService";

/* ── mensajes del bot ─────────────────────────────────────────── */
const MSG_INTRO      = "¡Hola! Vamos a ver si recuerdas a los amigos de los cuentos. ¡Toca la imagen correcta!";
const MSG_CORRECTO   = ["¡Muy bien! ¡Eso es!", "¡Excelente! ¡Lo lograste!", "¡Bravo! ¡Eres muy listo!"];
const MSG_INCORRECTO = ["¡Casi! Inténtalo la próxima vez.", "No te preocupes, sigue adelante.", "¡Tú puedes! A la siguiente lo logras."];
const MSG_DESPEDIDA  = "¡Felicitaciones! Terminaste el juego. ¡Eres un campeón de los cuentos del Perú!";

function msgAleatorio(lista: string[]) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function calcEstrellas(n: number) {
  if (n === 3) return "⭐⭐⭐";
  if (n === 2) return "⭐⭐";
  if (n === 1) return "⭐";
  return "🙁";
}

export default function PracticaProtagonistas() {
  const { hablar } = useBot();
  const navigate   = useNavigate();

  const [preguntaIdx, setPreguntaIdx]       = useState(0);
  const [estado, setEstado]                 = useState<Estado>("jugando");
  const [elegida, setElegida]               = useState<number | null>(null);
  const [aciertos, setAciertos]             = useState(0);
  const [introTerminada, setIntroTerminada] = useState(false);
  /* bloquea opciones mientras narra la pregunta */
  const [preguntaNarrada, setPreguntaNarrada] = useState(false);

  const despedidaLanzadaRef = useRef(false);
  const narracionIdRef      = useRef(0);

  const pregunta = PREGUNTAS[preguntaIdx];
  const esUltima = preguntaIdx === PREGUNTAS.length - 1;

  /* el niño puede tocar solo si la intro terminó Y la pregunta fue narrada */
  const puedeTocar = introTerminada && preguntaNarrada;

  /* ── Bloquear scroll ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* ── 1. Intro ── */
  useEffect(() => {
    hablar(MSG_INTRO, "es-PE", () => setIntroTerminada(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 2. Narrar la pregunta cada vez que cambia (igual que escenas en CuentosPage) ── */
  useEffect(() => {
    if (!introTerminada || estado === "final") return;

    setPreguntaNarrada(false);          // bloquea opciones mientras narra

    const miId = ++narracionIdRef.current;

    const timeoutId = setTimeout(() => {
      if (miId !== narracionIdRef.current) return;
      try {
        narrar(pregunta.texto, "es-PE", () => {
          if (miId !== narracionIdRef.current) return;
          setPreguntaNarrada(true);     // habilita opciones al terminar
        });
      } catch (err) {
        console.error("Error al narrar pregunta:", err);
        setPreguntaNarrada(true);       // habilita igual si falla
      }
    }, 60);

    return () => {
      clearTimeout(timeoutId);
      window.speechSynthesis.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preguntaIdx, introTerminada]);

  /* ── 3. Despedida al llegar al final ── */
  useEffect(() => {
    if (estado !== "final") return;
    if (despedidaLanzadaRef.current) return;
    despedidaLanzadaRef.current = true;

    hablar(MSG_DESPEDIDA, "es-PE", () => {
      navigate("/secciones");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  /* ── Elegir opción ── */
  function elegir(idx: number) {
    if (estado !== "jugando" || !puedeTocar) return;

    const correcto = idx === pregunta.correcta;
    setElegida(idx);
    if (correcto) setAciertos((a) => a + 1);
    setEstado("respondida");

    /* cancela narración en curso (pregunta) */
    narracionIdRef.current += 1;
    const miId = narracionIdRef.current;
    window.speechSynthesis.cancel();

    const mensaje = correcto
      ? msgAleatorio(MSG_CORRECTO)
      : msgAleatorio(MSG_INCORRECTO);

    setTimeout(() => {
      if (miId !== narracionIdRef.current) return;
      try {
        narrar(mensaje, "es-PE", () => {
          if (miId !== narracionIdRef.current) return;
          if (esUltima) {
            setTimeout(() => {
              if (miId !== narracionIdRef.current) return;
              setEstado("final");
            }, 400);
          }
        });
      } catch (err) {
        console.error("Error al narrar feedback:", err);
        if (esUltima) setEstado("final");
      }
    }, 60);
  }

  /* ── Siguiente pregunta ── */
  function siguiente() {
    if (!puedeTocar) return;
    narracionIdRef.current += 1;
    window.speechSynthesis.cancel();
    setPreguntaIdx((i) => i + 1);
    setElegida(null);
    setEstado("jugando");
    /* preguntaNarrada se resetea en el useEffect de preguntaIdx */
  }

  /* ── Reiniciar ── */
  function reiniciar() {
    narracionIdRef.current += 1;
    window.speechSynthesis.cancel();
    despedidaLanzadaRef.current = false;
    setPreguntaIdx(0);
    setElegida(null);
    setAciertos(0);
    setPreguntaNarrada(false);
    setEstado("jugando");
    hablar(MSG_INTRO, "es-PE", () => setIntroTerminada(true));
  }

  /* ── helpers de clase ── */
  function claseOpcion(idx: number) {
    if (estado === "jugando") return "pp-opcion";
    if (idx === pregunta.correcta) return "pp-opcion pp-opcion--correcto";
    if (idx === elegida)           return "pp-opcion pp-opcion--incorrecto";
    return "pp-opcion pp-opcion--apagado";
  }

  function clasePunto(i: number) {
    if (i < preguntaIdx)   return "pp-punto pp-punto--hecho";
    if (i === preguntaIdx) return "pp-punto pp-punto--activo";
    return "pp-punto";
  }

  /* ── texto del estado de espera ── */
  function textoEspera() {
    if (!introTerminada)  return "🎙️ Escucha la instrucción…";
    if (!preguntaNarrada) return "🎙️ Escucha la pregunta…";
    return "";
  }

  /* ── render ── */
  return (
    <div className="pp-wrapper">
      <div className="pp-overlay" />

      {/* ── JUEGO ── */}
      {estado !== "final" && (
        <div className="pp-contenido">

          <div className="pp-progreso">
            {PREGUNTAS.map((_, i) => (
              <div key={i} className={clasePunto(i)} />
            ))}
          </div>

          <div className="pp-burbuja">
            <p>{pregunta.texto}</p>
          </div>

          <div className={`pp-grid${!puedeTocar ? " pp-grid--bloqueado" : ""}`}>
            {pregunta.opciones.map((op, idx) => (
              <button
                key={idx}
                className={claseOpcion(idx)}
                onClick={() => elegir(idx)}
                disabled={estado !== "jugando" || !puedeTocar}
              >
                <img
                  src={op.img}
                  alt={op.nombre}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.background = "#ddd";
                  }}
                />
                <span>{op.emoji} {op.nombre}</span>
              </button>
            ))}
          </div>

          <p className="pp-feedback">
            {textoEspera()}
            {puedeTocar && estado === "respondida" &&
              (elegida === pregunta.correcta
                ? "¡Muy bien! ¡Lo lograste! 🎉"
                : "¡Casi! La respuesta es otra. 💪")}
          </p>

          {estado === "respondida" && !esUltima && (
            <button
              className="pp-btn"
              onClick={siguiente}
              disabled={!puedeTocar}
            >
              Siguiente ▶
            </button>
          )}
        </div>
      )}

      {/* ── FINAL ── */}
      {estado === "final" && (
        <div className="pp-final">
          <p className="pp-estrellas">{calcEstrellas(aciertos)}</p>
          <div className="pp-puntaje-box">
            <p className="pp-puntaje-label">Respondiste bien</p>
            <p className="pp-puntaje-num">{aciertos} / {PREGUNTAS.length}</p>
          </div>
          <button className="pp-btn" onClick={reiniciar}>
            ¡Jugar de nuevo!
          </button>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cancionespage.css";
import { canciones, type Cancion } from "./cancionesDTO";
import { useBot } from "../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";

type Idioma = "es" | "qu";

function CancionesPage() {
  const { hablar } = useBot();
  const navigate    = useNavigate();

  const [cancionIdx, setCancionIdx] = useState(0);
  const [idioma, setIdioma]         = useState<Idioma>("es");
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso]     = useState(0); // 0–100
  const [mostrarOverlay, setMostrarOverlay] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const introSpoken = useRef(false);

  const cancion: Cancion = canciones[cancionIdx];

  /* ── Bot narra de qué trata la sección, una sola vez ── */
  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;
    hablar(MENSAJES_SECCIONES.CANCIONES, "es-PE");
  }, []);

  /* ── Bloquear scroll de la página ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* ──────────────────────────────────────────
     Sincronización video (es) / audio (qu)
     - El <video> SIEMPRE se reproduce visualmente.
     - En "es": se escucha el audio propio del video.
     - En "qu": el video queda muteado y el <audio>
       en quechua suena en su lugar, arrancando
       desde el mismo punto que el video.
  ────────────────────────────────────────────── */

  /* Al cambiar de canción o de idioma: reinicia todo desde 0 */
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.muted = idioma === "qu";

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setProgreso(0);
    setReproduciendo(false);
    setMostrarOverlay(true);
  }, [cancionIdx, idioma]);

  /* Reproducir / pausar ambos en conjunto */
  const togglePlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    if (reproduciendo) {
      video.pause();
      audio?.pause();
      setReproduciendo(false);
    } else {
      video.play();
      if (idioma === "qu" && audio) {
        audio.currentTime = video.currentTime;
        audio.play();
      }
      setReproduciendo(true);
      setMostrarOverlay(false);
    }
  };

  /* Cambiar idioma: silencia/activa el video y arranca el audio sincronizado */
  const cambiarIdioma = (nuevo: Idioma) => {
    if (nuevo === idioma) return;

    const video = videoRef.current;
    const audio = audioRef.current;

    setIdioma(nuevo);

    if (video) {
      video.currentTime = 0;
      video.muted = nuevo === "qu";
    }
    if (audio) {
      audio.currentTime = 0;
      audio.pause();
    }

    setProgreso(0);
    setReproduciendo(false);
    setMostrarOverlay(true);
  };

  /* Actualizar barra de progreso en base al <video> (es la referencia maestra) */
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgreso((video.currentTime / video.duration) * 100);

    const audio = audioRef.current;
    if (idioma === "qu" && audio && Math.abs(audio.currentTime - video.currentTime) > 0.3) {
      audio.currentTime = video.currentTime;
    }
  };

  const onVideoEnd = () => {
    setReproduciendo(false);
    setMostrarOverlay(true);
    audioRef.current?.pause();
  };

  /* Saltar a un punto de la barra de progreso */
  const onClickProgreso = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const nuevoTiempo = ratio * video.duration;

    video.currentTime = nuevoTiempo;
    if (audio) audio.currentTime = nuevoTiempo;
  };

  /* Elegir otra canción de la lista */
  const seleccionarCancion = (idx: number) => {
    if (idx === cancionIdx) return;
    setCancionIdx(idx);
  };

  return (
    <div className="canciones-page">

      <button
        className="canciones-back-btn"
        onClick={() => navigate("/secciones")}
        aria-label="Volver"
      >
        ←
      </button>

      {/* ════ ESCENARIO — el video manda ════ */}
      <div className="cancion-stage">
        <video
          ref={videoRef}
          src={cancion.video}
          onTimeUpdate={onTimeUpdate}
          onEnded={onVideoEnd}
          playsInline
        />

        {idioma === "qu" && (
          <span className="cancion-modo-badge">🗣️ Quechua</span>
        )}

        {/* Audio de quechua, sincronizado por separado */}
        <audio ref={audioRef} src={cancion.audioQuechua} preload="auto" />

        <span className="cancion-titulo-flotante">{cancion.nombre}</span>

        <div
          className={`cancion-play-overlay ${mostrarOverlay ? "visible" : ""}`}
          onClick={togglePlay}
        >
          <button className="cancion-play-btn" aria-label={reproduciendo ? "Pausar" : "Reproducir"}>
            {reproduciendo ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ════ PANEL INFERIOR — controles + lista ════ */}
      <div className="canciones-panel">

        <div className="cancion-progreso" onClick={onClickProgreso}>
          <div className="cancion-progreso-fill" style={{ width: `${progreso}%` }} />
        </div>

        <div className="cancion-info-fila">
          <div className="idioma-toggle">
            <button
              className={idioma === "es" ? "activo" : ""}
              onClick={() => cambiarIdioma("es")}
            >
              Español
            </button>
            <button
              className={idioma === "qu" ? "activo" : ""}
              onClick={() => cambiarIdioma("qu")}
            >
              Quechua
            </button>
          </div>
        </div>

        <div className="canciones-lista">
          {canciones.map((c, idx) => (
            <button
              key={c.id}
              className={`cancion-card ${idx === cancionIdx ? "activa" : ""}`}
              onClick={() => seleccionarCancion(idx)}
            >
              <div className="cancion-card-thumb">
                <video src={c.video} muted preload="metadata" />
                <span className="cancion-card-thumb-icono">
                  {idx === cancionIdx && reproduciendo ? "🔊" : "▶️"}
                </span>
              </div>
              <span className="nombre">{c.nombre}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CancionesPage;
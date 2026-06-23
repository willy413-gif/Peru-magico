import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBot } from "../../bot/BotContext";
import { canciones, type Cancion } from "./cancionesDTO";
import "./CancionesPage.css";

type Idioma = "es" | "qu";

export default function CancionesPage() {
  const { hablar } = useBot();
  const navigate = useNavigate();

  const [indiceActual, setIndiceActual] = useState(0);
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [reproduciendo, setReproduciendo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const cancionActual: Cancion = canciones[indiceActual];

  useEffect(() => {
    hablar(
      "¡Bienvenido a canciones! Elige español o quechua y canta conmigo.",
      "es-PE"
    );
  }, []);

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
      audio.load();
    }

    video.load();
    setReproduciendo(false);
  }, [cancionActual, idioma]);

  const reproducirVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch (error) {
      console.log("No se pudo reproducir el video:", error);
    }
  };

  const pausarVideo = () => {
    videoRef.current?.pause();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      reproducirVideo();
    } else {
      pausarVideo();
    }
  };

  const handleVideoPlay = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video) return;

    if (idioma === "qu" && audio) {
      video.muted = true;
      audio.currentTime = video.currentTime;

      try {
        await audio.play();
      } catch (error) {
        console.log("No se pudo reproducir el audio quechua:", error);
      }
    }

    setReproduciendo(true);
  };

  const handleVideoPause = () => {
    audioRef.current?.pause();
    setReproduciendo(false);
  };

  const handleVideoSeeked = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (idioma === "qu" && video && audio) {
      audio.currentTime = video.currentTime;
    }
  };

  const handleVideoEnded = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setReproduciendo(false);
  };

  const cambiarIdioma = (nuevoIdioma: Idioma) => {
    if (nuevoIdioma === idioma) return;
    setIdioma(nuevoIdioma);
  };

  const cancionAnterior = () => {
    const nuevoIndice =
      indiceActual === 0 ? canciones.length - 1 : indiceActual - 1;

    setIndiceActual(nuevoIndice);
    setIdioma("es");
  };

  const cancionSiguiente = () => {
    const nuevoIndice =
      indiceActual === canciones.length - 1 ? 0 : indiceActual + 1;

    setIndiceActual(nuevoIndice);
    setIdioma("es");
  };

  return (
    <main className="canciones-page">
      <div className="canciones-overlay" />

      <button className="btn-volver-menu" onClick={() => navigate("/secciones")}>
        ← Menú
      </button>

      <section className="canciones-contenido">
        <div className="canciones-titulo-box">
          <span className="canciones-emoji">🎵</span>
          <h1>Canciones</h1>
          <p>Canta, mira y aprende jugando</p>
        </div>

        <div className="canciones-card">
          <div className="cancion-actual-header">
            <button className="btn-cancion-nav" onClick={cancionAnterior}>
              ◀
            </button>

            <div className="cancion-nombre-box">
              <span>Canción {indiceActual + 1} de {canciones.length}</span>
              <h2>{cancionActual.nombre}</h2>
            </div>

            <button className="btn-cancion-nav" onClick={cancionSiguiente}>
              ▶
            </button>
          </div>

          <div className="video-centro" onClick={togglePlay}>
            <video
              ref={videoRef}
              className="cancion-video"
              muted={idioma === "qu"}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onSeeked={handleVideoSeeked}
              onEnded={handleVideoEnded}
              playsInline
            >
              <source src={cancionActual.video} type="video/mp4" />
            </video>

            {!reproduciendo && (
              <div className="play-grande">
                <span>▶</span>
              </div>
            )}

            {idioma === "qu" && (
              <div className="badge-quechua">
                🪘 Quechua
              </div>
            )}
          </div>

          {idioma === "qu" && (
            <audio ref={audioRef} preload="auto">
              <source src={cancionActual.audioQuechua} type="audio/mpeg" />
            </audio>
          )}

          <div className="botones-idioma">
            <button
              className={`btn-idioma ${idioma === "es" ? "activo-es" : ""}`}
              onClick={() => cambiarIdioma("es")}
            >
              🇵🇪 Español
            </button>

            <button
              className={`btn-idioma ${idioma === "qu" ? "activo-qu" : ""}`}
              onClick={() => cambiarIdioma("qu")}
            >
              🪘 Quechua
            </button>
          </div>

          <button className="btn-play-principal" onClick={togglePlay}>
            {reproduciendo ? "⏸ Pausar" : "▶ Cantar"}
          </button>

          <p className="mensaje-cancion">
            {idioma === "es"
              ? "Estás escuchando la canción en español."
              : "El video se reinicia, se silencia y suena el audio en quechua."}
          </p>
        </div>
      </section>
    </main>
  );
}
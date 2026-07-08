import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBot } from "../../bot/BotContext";
import "./MenuJuegosPage.css";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";
import { JUEGOS, type Juego } from "./JuegosDto";

function MenuJuegosPage() {
  const { hablar } = useBot();
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState<Juego[]>([]);

  useEffect(() => {
    hablar(MENSAJES_SECCIONES.MENU_JUEGOS);
  }, [hablar]);

  useEffect(() => {
    const cargar = async () => {
      setJuegos(JUEGOS || []);
    };
    cargar();
  }, []);

  return (
    <div className="menu-juegos-page">
        <button
            className="comida-back-btn"
            onClick={() => navigate("/secciones")}
            aria-label="Volver al menú"
            >
            ←
        </button>
      <div className="overlay"></div>
      <div className="contenido-juegos">
        <div className="bienvenida-juegos">
          <h1>¿Qué juego quieres jugar?</h1>
          <p>
            Escoge una aventura y sigue aprendiendo
            sobre la cultura del Perú mientras te
            diviertes.
          </p>
        </div>
        <div className="juegos-grid">
          {juegos.map((juego) => (
            <div
              key={juego.id}
              className="juego-card"
              onClick={() => navigate(`/juegos/${juego.id}`)}
            >
              <div className="juego-imagen-container">
                <img
                  className="juego-imagen"
                  src={juego.imagen_url}
                  alt={juego.nombre}
                />
              </div>
              <div className="juego-card-texto">
                <h2>{juego.nombre}</h2>
                <p>{juego.objetivo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuJuegosPage;
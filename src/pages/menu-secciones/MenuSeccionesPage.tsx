import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBot } from "../../bot/BotContext";
import "./MenuSeccionesPage.css";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";
import { SECCIONES } from "./MenuSeccionesDTO";

function MenuSeccionesPage() {
  const { hablar } = useBot();
  const navigate = useNavigate();

  useEffect(() => {
    hablar(MENSAJES_SECCIONES.MENU_PRINCIPAL);
  }, [hablar]);

  return (
    <div className="menu-secciones-page">
      <div className="overlay" />

      <div className="contenido-secciones">

        <div className="bienvenida-secciones">
          <h1>¿Qué quieres <span>explorar</span> hoy?</h1>
          <p>
            Elige una sección y vive una aventura aprendiendo
            sobre la cultura y las tradiciones del Perú.
          </p>
        </div>

        <div className="secciones-grid">
          {SECCIONES.map((seccion) => (
            <button
              key={seccion.id}
              className={`seccion-card ${seccion.claseColor}`}
              onClick={() => navigate(seccion.ruta)}
            >
              <div className="seccion-icono-wrap">
                <span className="seccion-emoji">{seccion.emoji}</span>
              </div>
              <div className="seccion-card-body">
                <h2>{seccion.nombre}</h2>
                <p>{seccion.descripcion}</p>
                <span className="seccion-card-flecha">Entrar</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MenuSeccionesPage;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useBot } from "../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";
import "./Welcome.css";
import { BOT_CONFIG } from "../../bot/BotConfig";
import BotGuia from "../../bot/BotGuia";
import { useNavigate } from "react-router-dom";


function Welcome() {

  const { mensaje, hablar } = useBot();
  const navigate = useNavigate();
  const [yaClickeado, setYaClickeado] = useState(false);

    useEffect(() => {
      hablar(MENSAJES_SECCIONES.HOME);
    }, []);

  return (
      <div className="inicio-container">

        <div className="inicio-overlay">

          <div className="titulo-principal">
            Peru Mágico
          </div>

          <div className="subtitulo">
            Aprende sobre el Perú jugando
          </div>

          <div className="bot-container">
            <BotGuia
              nombre={BOT_CONFIG.nombre}
              avatar={BOT_CONFIG.avatar}
              mensaje={mensaje}
              centrado
            />
          </div>

          <button 
            className="btn-jugar"
            disabled={yaClickeado}
            onClick={() => {
              if (yaClickeado) return;
              setYaClickeado(true);
                hablar(
                  MENSAJES_SECCIONES.JUGAR,
                  "es-PE",
                  () => navigate("/cuentos")
                );
              }}
          >
            ▶ JUGAR
          </button>

          <div className="info-audio">
            🔊 Activa el volumen de tu dispositivo
          </div>

        </div>

      </div>
  );
}

export default Welcome;
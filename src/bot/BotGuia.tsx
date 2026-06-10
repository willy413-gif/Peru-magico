import "./BotGuia.css";

interface BotGuiaProps {
  nombre: string;
  avatar: string;
  mensaje: string;
  centrado?: boolean;
}

function BotGuia({
  nombre,
  avatar,
  mensaje,
  centrado = false,
}: BotGuiaProps) {

  return (
    <div   
      className={
        centrado
          ? "bot-guia bot-guia-centrado"
          : "bot-guia"
      }
    >

      <div className="chat-bubble">
        {mensaje}
      </div>

      <img
        src={avatar}
        alt={nombre}
        className="bot-avatar"
      />

    </div>
  );
}

export default BotGuia;
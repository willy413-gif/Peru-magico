import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cuentospage.css";
import { CUENTOS } from "./cuentosDTO";
import { useBot } from "../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";
import { narrar } from "../../bot/BotService";

function CuentosPage() {
  const { hablar } = useBot();
  const navigate    = useNavigate();

  const [idioma, setIdioma]                 = useState<"es" | "qu">("es");
  const [cuentoIdx, setCuentoIdx]           = useState(0);
  const [escenaIdx, setEscenaIdx]           = useState(0);
  const [terminado, setTerminado]           = useState(false);
  const [introTerminada, setIntroTerminada] = useState(false);

  const despedidaLanzadaRef = useRef(false);
  const narracionIdRef = useRef(0);

  const totalCuentos = CUENTOS.length;
  const cuento        = CUENTOS[cuentoIdx];
  const escena         = cuento?.escenas[escenaIdx];

  useEffect(() => {
    hablar(
      MENSAJES_SECCIONES.CUENTOS,
      "es-PE",
      () => setIntroTerminada(true),
    );
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const irA = (nuevoCuentoIdx: number, nuevaEscenaIdx: number) => {
    setCuentoIdx(nuevoCuentoIdx);
    setEscenaIdx(nuevaEscenaIdx);
  };

  const avanzar = () => {
    const esUltimaEscena = escenaIdx === 3;
    const esUltimoCuento = cuentoIdx === totalCuentos - 1;
    if (esUltimaEscena && esUltimoCuento) { setTerminado(true); return; }
    if (esUltimaEscena) { irA(cuentoIdx + 1, 0); } else { irA(cuentoIdx, escenaIdx + 1); }
  };

  const retroceder = () => {
    const esPrimeraEscena = escenaIdx === 0;
    const esPrimerCuento  = cuentoIdx === 0;
    if (esPrimeraEscena && esPrimerCuento) return;
    if (esPrimeraEscena) { irA(cuentoIdx - 1, 3); } else { irA(cuentoIdx, escenaIdx - 1); }
  };

  const avanzarManual = () => {
    if (!introTerminada) return;
    narracionIdRef.current += 1;
    window.speechSynthesis.cancel();
    avanzar();
  };

  const retrocederManual = () => {
    if (!introTerminada) return;
    narracionIdRef.current += 1;
    window.speechSynthesis.cancel();
    retroceder();
  };

  useEffect(() => {
    if (!introTerminada || terminado || !escena) return;
    const miId = ++narracionIdRef.current;
    const texto           = idioma === "es" ? escena.texto_es : escena.texto_qu;
    const idiomaNarracion = idioma === "es" ? "es-PE" : "qu";

    const timeoutId = setTimeout(() => {
      if (miId !== narracionIdRef.current) return;
      try {
        narrar(texto, idiomaNarracion, () => {
          if (miId !== narracionIdRef.current) return;
          setTimeout(() => {
            if (miId !== narracionIdRef.current) return;
            avanzar();
          }, 400);
        });
      } catch (err) {
        console.error("Error al narrar escena:", err);
      }
    }, 60);

    return () => {
      clearTimeout(timeoutId);
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentoIdx, escenaIdx, idioma, introTerminada, terminado]);

  useEffect(() => {
    if (!terminado || despedidaLanzadaRef.current) return;
    despedidaLanzadaRef.current = true;
    hablar(
      "¡Qué gran aventura! Has recorrido la Costa, la Sierra y la Selva del Perú. Ahora vamos a ver si pusiste atencion",
      "es-PE",
      () => { navigate("/cuentos-game"); },
    );
  }, [terminado]);

  const cambiarIdioma = (nuevo: "es" | "qu") => {
    if (nuevo === idioma) return;
    narracionIdRef.current += 1;
    window.speechSynthesis.cancel();
    setIdioma(nuevo);
  };

  const esPrimeraEscenaGlobal = cuentoIdx === 0 && escenaIdx === 0;
  const esUltimaEscenaGlobal  = cuentoIdx === totalCuentos - 1 && escenaIdx === 3;

  if (CUENTOS.length === 0) {
    return (
      <div className="cuentos-page">
        <span className="cargando">Abriendo el libro de cuentos…</span>
      </div>
    );
  }

  return (
    <div className="cuentos-page">
      <img key={escena.imagen} src={escena.imagen} className="cuentos-bg" />
      <div className="cuentos-overlay" />

      {/* ── Barra superior ── */}
      <div className="controles-superior">
        <p className="cuento-titulo-top">{cuento.titulo}</p>

        <div className="idioma-pills">
          <button
            className={`btn-idioma ${idioma === "es" ? "activo" : ""}`}
            onClick={() => cambiarIdioma("es")}
            disabled={!introTerminada}
          >
            Español
          </button>
          <button
            className={`btn-idioma ${idioma === "qu" ? "activo" : ""}`}
            onClick={() => cambiarIdioma("qu")}
            disabled={!introTerminada}
          >
            Quechua
          </button>
        </div>

        <button
          className="btn-continuar"
          onClick={() => { navigate("/secciones"); }}
        >
          Secciones
        </button>
      </div>

      {/* ── Barra inferior: texto + dots ── */}
      <div className="controles-inferior">
        <p className="cuento-indicador">{cuento.titulo}</p>
        <p className="tarjeta-texto">
          {idioma === "es" ? escena.texto_es : escena.texto_qu}
        </p>
        <div className="progreso-fila">
          <button
            className="btn-nav-escena btn-nav-escena--atras"
            onClick={retrocederManual}
            disabled={esPrimeraEscenaGlobal || !introTerminada}
          >⟸</button>
          <div className="escena-dots">
            {cuento.escenas.map((_, i) => (
              <span
                key={i}
                className={`escena-dot ${i === escenaIdx ? "activo" : ""} ${i < escenaIdx ? "hecho" : ""}`}
              />
            ))}
          </div>
          <button
            className="btn-nav-escena btn-nav-escena--siguiente"
            onClick={avanzarManual}
            disabled={esUltimaEscenaGlobal || !introTerminada}
          >⟹</button>
        </div>
      </div>
    </div>
  );
}

export default CuentosPage;
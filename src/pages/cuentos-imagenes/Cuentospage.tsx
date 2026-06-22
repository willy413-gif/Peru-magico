import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CuentosPage.css";
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

  /* ── ID de narración: invalida callbacks de narraciones viejas/canceladas ── */
  const narracionIdRef = useRef(0);

  const totalCuentos = CUENTOS.length;
  const cuento        = CUENTOS[cuentoIdx];
  const escena         = cuento?.escenas[escenaIdx];

  /* ── Intro hablada ── */
  useEffect(() => {
    hablar(
      MENSAJES_SECCIONES.CUENTOS,
      "es-PE",
      () => setIntroTerminada(true),
    );
  }, []);

  /* ── Bloquear scroll ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* ── Ir a una escena/cuento puntual (usado por avanzar/retroceder) ── */
  const irA = (nuevoCuentoIdx: number, nuevaEscenaIdx: number) => {
    setCuentoIdx(nuevoCuentoIdx);
    setEscenaIdx(nuevaEscenaIdx);
  };

  /* ── Avanzar a la siguiente escena / cuento ── */
  const avanzar = () => {
    const esUltimaEscena = escenaIdx === 3;
    const esUltimoCuento = cuentoIdx === totalCuentos - 1;

    if (esUltimaEscena && esUltimoCuento) {
      setTerminado(true);
      return;
    }

    if (esUltimaEscena) {
      irA(cuentoIdx + 1, 0);
    } else {
      irA(cuentoIdx, escenaIdx + 1);
    }
  };

  /* ── Retroceder a la escena / cuento anterior ── */
  const retroceder = () => {
    const esPrimeraEscena = escenaIdx === 0;
    const esPrimerCuento  = cuentoIdx === 0;

    if (esPrimeraEscena && esPrimerCuento) return; // ya no hay a dónde ir

    if (esPrimeraEscena) {
      irA(cuentoIdx - 1, 3);
    } else {
      irA(cuentoIdx, escenaIdx - 1);
    }
  };

  /* ── Avance/retroceso manual: cancela narración vieja e invalida su callback ── */
const avanzarManual = () => {
  if (!introTerminada) return;          // ← nuevo guard
  narracionIdRef.current += 1;
  window.speechSynthesis.cancel();
  avanzar();
};

const retrocederManual = () => {
  if (!introTerminada) return;          // ← nuevo guard
  narracionIdRef.current += 1;
  window.speechSynthesis.cancel();
  retroceder();
};

  

  /* ── Narrar la escena actual; al terminar, avanza sola ── */
  useEffect(() => {
    if (!introTerminada || terminado || !escena) return;

    // Nuevo id para esta narración — cualquier callback con id viejo se ignora
    const miId = ++narracionIdRef.current;

    const texto           = idioma === "es" ? escena.texto_es : escena.texto_qu;
    const idiomaNarracion = idioma === "es" ? "es-PE" : "qu";

    // Pequeño delay: le da tiempo al cancel() anterior a asentarse
    // antes de pedir una narración nueva (evita que el navegador
    // descarte la nueva petición por considerar que sigue "cancelando").
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

  /* ── Despedida al terminar ── */
  useEffect(() => {
    if (!terminado || despedidaLanzadaRef.current) return;
    despedidaLanzadaRef.current = true;

    hablar(
      "¡Qué gran aventura! Has recorrido la Costa, la Sierra y la Selva del Perú. Ahora vamos a ver si pusiste atencion",
      "es-PE",
      () => { navigate("/cuentos-game"); },
    );
  }, [terminado]);

  /* ── Cambiar idioma reinicia narración de la escena actual ── */
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

      {terminado ? (
        /* ── Pantalla de fin ── */
        <>

          <div className="preload-overlay">
            <div className="preload-spinner">
              <div className="preload-dots">
                <span /><span /><span />
              </div>
              Preparando el cuento…
            </div>
          </div>
          <img
            src={CUENTOS[totalCuentos - 1].escenas[3].imagen}
            alt="Fin"
            className="cuentos-bg"
          />
          <div className="cuentos-overlay" />
          <div className="cuentos-contenido">
            <div className="tarjeta-fin">
              <span className="tarjeta-fin-emoji">🎉</span>
              <span className="tarjeta-fin-estrellas">★ ★ ★</span>
              <h2>¡Llegaste al final!</h2>
              <p>Has escuchado todos los cuentos mágicos del Perú. ¡Eres un gran lector!</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Imagen de fondo de la escena actual */}
          <img
            key={escena.imagen}
            src={escena.imagen}
            alt={`${cuento.titulo} - escena ${escenaIdx + 1}`}
            className="cuentos-bg"
          />
          <div className="cuentos-overlay" />

          {/* Badge región */}
          <span className="tarjeta-region-tag">{cuento.regionLabel}</span>

          {/* Título — solo en la primera escena */}
          {escenaIdx === 0 && (
            <h1 className="tarjeta-titulo">{cuento.titulo}</h1>
          )}

          {/* Texto centrado */}
          <div className="cuentos-contenido">
            <div className="tarjeta-texto-wrap">
              <p className="tarjeta-texto">
                {idioma === "es" ? escena.texto_es : escena.texto_qu}
              </p>

              <div className="progreso-fila">
                {/* Botón atrás */}
                <button
                  className="btn-nav-escena btn-nav-escena--atras"
                  onClick={retrocederManual}
                  disabled={esPrimeraEscenaGlobal || !introTerminada}
                  aria-label="Parte anterior del cuento"
                  title="Atrás"
                >
                  ⟸
                </button>

                <div className="escena-dots">
                  {cuento.escenas.map((_, i) => (
                    <span
                      key={i}
                      className={`escena-dot ${i === escenaIdx ? "activo" : ""} ${i < escenaIdx ? "hecho" : ""}`}
                    />
                  ))}
                </div>

                {/* Botón siguiente */}
                <button
                  className="btn-nav-escena btn-nav-escena--siguiente"
                  onClick={avanzarManual}
                  disabled={esUltimaEscenaGlobal || !introTerminada}
                  aria-label="Siguiente parte del cuento"
                  title="Siguiente"
                >
                  ⟹
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Controles inferiores ── */}
      <div className="controles-inferior">
        {!terminado && (
          <p className="cuento-indicador">{cuento.titulo}</p>
        )}

        <div className="fila-controles">
          {!terminado && (
            <>
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
            </>
          )}

          <button
            className="btn-continuar"
            onClick={() => {
              narracionIdRef.current += 1;
              window.speechSynthesis.cancel();
              navigate("/secciones");
            }}
          >
            secciones
          </button>
        </div>
      </div>

    </div>
  );
}

export default CuentosPage;
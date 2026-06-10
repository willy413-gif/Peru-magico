import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./CuentosPage.css";
import { supabase } from "../../services/supabase";
import type { Cuento } from "./CuentoDto";
import { useBot } from "../../bot/BotContext";
import { MENSAJES_SECCIONES } from "../../bot/BotMensajes";
import { narrar } from "../../bot/BotService";
import { useNavigate } from "react-router-dom";

type FlipBookHandle = {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    getCurrentPageIndex: () => number;
  };
};

function CuentosPage() {
  const [cuentos, setCuentos] = useState<Cuento[]>([]);
  const [idioma, setIdioma] = useState<"es" | "qu">("es");
  const [paginaActual, setPaginaActual] = useState(0);
  const { hablar } = useBot();
  const [introTerminada, setIntroTerminada] = useState(false);
  const libroRef = useRef<FlipBookHandle>(null);
  const navigate = useNavigate();
  const despedidaLanzadaRef = useRef(false);
  const cuentoNarradoRef = useRef<string>("");
  


  useEffect(() => {
    hablar(
        MENSAJES_SECCIONES.CUENTOS,
        "es-PE",
        () => { setIntroTerminada(true); }
    );
    },[]);

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from("cuentos")
        .select("*")
        .order("orden");
      setCuentos(data || []);
    };
    cargar();
  }, []);


useEffect(() => {
  if (!introTerminada) return;
  if (paginaActual >= cuentos.length * 2) return;

  const cuentoIndex = Math.floor(paginaActual / 2);
  const cuento = cuentos[cuentoIndex];
  if (!cuento) return;

  // 🔑 Clave compuesta: índice + idioma
  const claveActual = `${cuentoIndex}-${idioma}`;
  if (cuentoNarradoRef.current === claveActual) return;
  cuentoNarradoRef.current = claveActual;

  window.speechSynthesis.cancel(); // cancela lo anterior al cambiar idioma

  const texto = idioma === "es" ? cuento.contenido : cuento.contenido_quechua;
  const idiomaNarracion = idioma === "es" ? "es-PE" : "qu";

  narrar(texto, idiomaNarracion, () => {
    const ultimoCuento = cuentos.length - 1;

    if (cuentoIndex === ultimoCuento && !despedidaLanzadaRef.current) {
      despedidaLanzadaRef.current = true;

      hablar(
        "¡Qué gran aventura! Has recorrido la Costa, la Sierra y la Selva del Perú. Gracias por escuchar nuestros cuentos. Ahora vamos a seguir aprendiendo con una nueva actividad.",
        "es-PE",
        () => { navigate("/menu-juegos"); }
      );
    }
  });

}, [paginaActual, idioma, cuentos, introTerminada, hablar, navigate]);

  if (cuentos.length === 0) {
    return (
      <div className="cuentos-page">
        <span className="cargando">Abriendo el libro de cuentos…</span>
      </div>
    );
  }



  return (
    <div className="cuentos-page">

      <div className="libro-wrapper">
        <HTMLFlipBook
          ref={libroRef}
          width={320}
          height={440}
          size="fixed"
          minWidth={280}
          maxWidth={380}
          minHeight={380}
          maxHeight={500}
          showCover={false}
          mobileScrollSupport={false}
          onFlip={(e: { data: number }) => setPaginaActual(e.data)}
          className="libro-flip"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={700}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          maxShadowOpacity={0.45}
        >
          {/* ── Páginas de cuentos ── */}
          {cuentos.flatMap((cuento) => [

            /* Página izquierda — imagen */
            <div key={`img-${cuento.id}`} className="pagina pagina-imagen">
              <img src={cuento.imagen_url} alt={cuento.titulo} />
              <div className="pagina-imagen-footer">
                <span className="region-tag">{cuento.region}</span>
                <p className="pagina-imagen-caption">{cuento.titulo}</p>
              </div>
            </div>,

            /* Página derecha — texto + flecha */
            <div key={`txt-${cuento.id}`} className="pagina pagina-texto">
              <div className="pagina-ornamento">✦ ✦ ✦</div>
              <h2 className="pagina-titulo">{cuento.titulo}</h2>
              <div className="pagina-divider" />

              <p className="pagina-contenido">
                {idioma === "es"
                  ? cuento.contenido
                  : cuento.contenido_quechua}
              </p>

            </div>,

          ])}



        </HTMLFlipBook>
      </div>

      {/* ── Idioma debajo del libro ── */}
      <div className="controles-idioma">
        <button
          className={`btn-idioma ${idioma === "es" ? "activo" : ""}`}
          onClick={() => setIdioma("es")}
        >
        Español
        </button>
        <button
          className={`btn-idioma ${idioma === "qu" ? "activo" : ""}`}
          onClick={() => setIdioma("qu")}
        >
        Quechua
        </button>
      </div>

        <div className="acciones-cuentos">
          <button
            className="btn-continuar"
            onClick={() => {

              window.speechSynthesis.cancel();

              navigate("/menu-juegos");

            }}
          >
             Nueva aventura
          </button>
        </div>

    </div>
  );
}

export default CuentosPage;
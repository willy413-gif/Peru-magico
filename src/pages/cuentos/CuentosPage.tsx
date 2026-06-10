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

/* ── Detectar si es dispositivo táctil / móvil ── */
const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
  ("ontouchstart" in window && window.screen.width < 1024);

/* ── Hook: devuelve true si orientation es portrait ── */
function useIsPortrait() {
  const check = () =>
    typeof window !== "undefined" && window.innerHeight > window.innerWidth;
  const [portrait, setPortrait] = useState(check);

  useEffect(() => {
    const handler = () => setPortrait(check());
    window.addEventListener("resize", handler);
    // ScreenOrientation API (más precisa en móvil)
    screen.orientation?.addEventListener("change", handler);
    return () => {
      window.removeEventListener("resize", handler);
      screen.orientation?.removeEventListener("change", handler);
    };
  }, []);

  return portrait;
}

/* ── Hook: dimensiones del libro según viewport ── */
function useBookSize() {
  const getSize = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isLandscape = vw > vh;

    if (isLandscape) {
      // En landscape calculamos cuánto puede crecer el libro
      // El libro tiene DOS páginas side-by-side → width = una página
      const maxH = Math.min(vh * 0.72, 440); // máx 72% del alto
      const maxW = Math.min(vw * 0.38, 320); // máx 38% del ancho (es una hoja)
      const bookH = Math.max(maxH, 280);
      const bookW = Math.max(maxW, 220);
      return { width: Math.round(bookW), height: Math.round(bookH) };
    }

    // Portrait (desktop): tamaño original
    return { width: 320, height: 440 };
  };

  const [size, setSize] = useState(getSize);
  useEffect(() => {
    const handler = () => setSize(getSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

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

  const isPortrait = useIsPortrait();
  const isMobile = isMobileDevice();
  const { width: bookW, height: bookH } = useBookSize();

  useEffect(() => {
    hablar(
      MENSAJES_SECCIONES.CUENTOS,
      "es-PE",
      () => { setIntroTerminada(true); }
    );
  }, []);

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

    const claveActual = `${cuentoIndex}-${idioma}`;
    if (cuentoNarradoRef.current === claveActual) return;
    cuentoNarradoRef.current = claveActual;

    window.speechSynthesis.cancel();

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
    <>
      {/* ══ OVERLAY: pedir rotar pantalla (solo móvil en portrait) ══ */}
      {isMobile && isPortrait && (
        <div className="rotate-overlay" role="alert" aria-live="polite">
          <span className="rotate-overlay__icon">📱</span>
          <p className="rotate-overlay__titulo">Gira tu pantalla</p>
          <p className="rotate-overlay__sub">
            Para leer el libro de cuentos, pon tu teléfono en horizontal 🌅
          </p>
        </div>
      )}

      <div className="cuentos-page">
        <div className="libro-wrapper">
          <HTMLFlipBook
            ref={libroRef}
            width={bookW}
            height={bookH}
            size="fixed"
            minWidth={220}
            maxWidth={380}
            minHeight={280}
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
            {cuentos.flatMap((cuento) => [
              /* Página izquierda — imagen */
              <div key={`img-${cuento.id}`} className="pagina pagina-imagen">
                <img src={cuento.imagen_url} alt={cuento.titulo} />
                <div className="pagina-imagen-footer">
                  <span className="region-tag">{cuento.region}</span>
                  <p className="pagina-imagen-caption">{cuento.titulo}</p>
                </div>
              </div>,

              /* Página derecha — texto */
              <div key={`txt-${cuento.id}`} className="pagina pagina-texto">
                <div className="pagina-ornamento">✦ ✦ ✦</div>
                <h2 className="pagina-titulo">{cuento.titulo}</h2>
                <div className="pagina-divider" />
                <p className="pagina-contenido">
                  {idioma === "es" ? cuento.contenido : cuento.contenido_quechua}
                </p>
              </div>,
            ])}
          </HTMLFlipBook>
        </div>

        {/* ── Idioma ── */}
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
    </>
  );
}

export default CuentosPage;
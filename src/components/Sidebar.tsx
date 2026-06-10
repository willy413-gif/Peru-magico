import { useState } from "react";

interface SidebarProps {
  seccion: string;
  setSeccion: (seccion: string) => void;
}

function Sidebar({ seccion, setSeccion }: SidebarProps) {
  const [mostrarHerramientas, setMostrarHerramientas] = useState(false);

  return (
    <aside className="sidebar">
      {/* Encabezado del menú (Sirve para volver al Inicio) */}
      <div className="sidebar-header" onClick={() => setSeccion("HOME")}>
        <h1 className="sidebar-title">🇵🇪 Perú Cultural</h1>
        <p className="sidebar-subtitle">Aprende jugando</p>
      </div>

      {/* MENÚ DE SECCIONES */}
      <nav className="sidebar-nav">
        <button
          className={`nav-btn ${seccion === "VESTIMENTAS" ? "active" : ""}`}
          onClick={() => setSeccion("VESTIMENTAS")}
        >
          <span className="nav-icon"></span> 
          <span className="nav-text">Vestimentas</span>
        </button>

        <button className="nav-btn disabled" disabled>
          <span className="nav-icon"></span> 
          <span className="nav-text">Canciones</span>
          <span className="lock-icon"></span>
        </button>

        <button className="nav-btn disabled" disabled>
          <span className="nav-icon"></span> 
          <span className="nav-text">Poemas</span>
          <span className="lock-icon"></span>
        </button>

        {/* SECCIÓN DESPLEGABLE DE HERRAMIENTAS */}
        <div className="tools-accordion">
          <button
            className="tools-toggle-btn"
            onClick={() => setMostrarHerramientas(!mostrarHerramientas)}
          >
            <span className="nav-icon"></span>
            <span className="nav-text">Herramientas</span>
            <span className="arrow-icon">{mostrarHerramientas ? "▼" : "▶"}</span>
          </button>

          {mostrarHerramientas && (
            <div className="sidebar-submenu">
              <button
                className={`submenu-item ${seccion === "SUBIR_PRENDA" ? "active" : ""}`}
                onClick={() => setSeccion("SUBIR_PRENDA")}
              >
                 Subir Prenda
              </button>

              <button className="submenu-item" disabled>
                 Subir Poema 
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
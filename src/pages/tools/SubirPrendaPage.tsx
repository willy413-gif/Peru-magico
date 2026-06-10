/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../services/supabase";
import Draggable from "react-draggable"; 
import "./SubirPrendaPage.css"; 

function SubirPrendaPage() {
  // --- CAMPOS DEL FORMULARIO ---
  const [nombre, setNombre] = useState("");
  const [region, setRegion] = useState("SIERRA");
  const [categoria, setCategoria] = useState("TORSO");
  const [slotAccesorio, setSlotAccesorio] = useState("");
  const [sexo, setSexo] = useState("HOMBRE");
  const [descripcion, setDescripcion] = useState("");
  const [imageUrl, setImageUrl] = useState(""); 

  // --- COORDENADAS Y CONFIGURACIÓN DE CALIBRACIÓN ---
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [escala, setEscala] = useState(1.0);
  const [zIndex, setZIndex] = useState(2);


  // --- REFERENCIA DEL NODO DRAGGABLE (Evita el crash de React 18) ---
  const nodoDraggableRef = useRef<HTMLDivElement>(null);


  // Captura las coordenadas físicas exactas al soltar el arrastre
  const handleDragStop = (_e: any, data: any) => {
  setPosX(data.x);
  setPosY(data.y);
};

  // Enviar y publicar la prenda en Supabase
  const handleGuardarPrenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !imageUrl) {
      alert("Por favor, ingresa el nombre y la URL de la imagen.");
      return;
    }

    const nuevaPrenda = {
      nombre,
      region,
      categoria,
      imagen_url: imageUrl,
      descripcion: descripcion || null,
      pos_x: posX,
      pos_y: posY,
      escala: parseFloat(escala.toFixed(2)),
      z_index: zIndex,
      sexo,
      slot_accesorio: categoria === "ACCESORIO" ? slotAccesorio : null,
      activo: true
    };

    const { error } = await supabase.from("vestimentas").insert([nuevaPrenda]);

    if (error) {
      console.error("Error al guardar:", error.message);
      alert("Hubo un error al guardar en la base de datos.");
    } else {
      alert("¡Prenda guardada y calibrada con éxito!");
      // Resetear formulario y posiciones
      setNombre("");
      setImageUrl("");
      setPosX(0);
      setPosY(0);
      setEscala(1.0);
    }
  };

  return (
    <div className="subir-prenda-layout">
      
      {/* SECCIÓN IZQUIERDA: DISEÑO SIMÉTRICO DEL PROBADOR */}
      <div className="avatar-section-wrapper">
        
        {/* Filtro Superior de Género */}
        <div className="gender-filter-top">
          <button 
            type="button"
            className={`gender-btn ${sexo === "HOMBRE" ? "active-admin-gender" : ""}`}
            onClick={() => setSexo("HOMBRE")}
          >
            Chico
          </button>
          <button 
            type="button"
            className={`gender-btn ${sexo === "MUJER" ? "active-admin-gender" : ""}`}
            onClick={() => setSexo("MUJER")}
          >
            Chica
          </button>
        </div>

        {/* Lienzo del Canvas/Calibrador */}
        <div className="vp-center">
          <div className="vp-avatar-card">

            <div className="vp-avatar-glow" />

            <div className="vp-avatar-frame">

              <img
                src="/avatar/avatar_h_b.png"
                alt="Avatar Base"
                className="vp-avatar-base"
              />

              {imageUrl && (
                <Draggable
                  nodeRef={nodoDraggableRef}
                  position={{ x: posX, y: posY }}
                  onStop={handleDragStop}
                >
                  <div
                    ref={nodoDraggableRef}
                    className="vp-avatar-layer"
                    style={{
                      zIndex
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Prenda"
                      style={{
                        transform: `scale(${escala})`
                      }}
                      draggable={false}
                    />
                  </div>
                </Draggable>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO PANEL DE CONTROL */}
      <div className="calibrator-sidebar">
        <form onSubmit={handleGuardarPrenda} className="calibrator-form-wrapper">
          
          <div className="sidebar-section-title">
            <h3>Registro e Ingreso</h3>
          </div>

          <div className="admin-input-group">
            <label>Nombre de la Prenda</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Poncho Cuzqueño Elegante" 
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-input-group">
              <label>Género / Modelo</label>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>
            <div className="admin-input-group">
              <label>Región Origen</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="COSTA">Costa</option>
                <option value="SIERRA">Sierra</option>
                <option value="SELVA">Selva</option>
              </select>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-input-group">
              <label>Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="TORSO">Torso</option>
                <option value="PIERNAS">Piernas</option>
                <option value="CALZADO">Calzado</option>
                <option value="ACCESORIO">Accesorio</option>
              </select>
            </div>

            {categoria === "ACCESORIO" && (
              <div className="admin-input-group">
                <label>Slot Accesorio</label>
                <select value={slotAccesorio} onChange={(e) => setSlotAccesorio(e.target.value)} required>
                  <option value="">-- Seleccionar --</option>
                  <option value="CABEZA">Cabeza</option>
                  <option value="CUELLO">Cuello</option>
                  <option value="MUÑECA">Muñeca</option>
                  <option value="TOBILLOS">Tobillos</option>
                </select>
              </div>
            )}
          </div>

          <div className="admin-input-group">
            <label>URL del Recurso (PNG Transparente)</label>
            <input 
              type="text" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://..." 
            />
          </div>

          <div className="admin-input-group">
            <label>Descripción Cultural</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Datos históricos o de manufactura..." 
              rows={2} 
            />
          </div>

          {/* CONTROLES DE DIMENSIÓN AISLADOS */}
          <div className="admin-flat-panel">
            <div className="flat-panel-header">
              <span>Escala de visualización</span>
              <span className="badge-value">{escala.toFixed(2)}x</span>
            </div>
            <div className="admin-grid-2">
              <button type="button" className="btn-admin-action" onClick={() => setEscala((prev) => prev + 0.05)}>Aumentar</button>
              <button type="button" className="btn-admin-action" onClick={() => setEscala((prev) => Math.max(0.1, prev - 0.05))}>Reducir</button>
            </div>
          </div>

          {/* CONTROL DE COORDENADAS CAPTURADAS */}
          <div className="admin-flat-panel">
            <div className="flat-panel-header">
              <span>Coordenadas de Anclaje</span>
            </div>
            <div className="admin-grid-3">
              <div>
                <span className="mini-lbl">Pos X (px)</span>
                <input type="number" className="input-locked" value={posX} readOnly />
              </div>
              <div>
                <span className="mini-lbl">Pos Y (px)</span>
                <input type="number" className="input-locked" value={posY} readOnly />
              </div>
              <div>
                <span className="mini-lbl">Z-Index</span>
                <input 
                  type="number" 
                  value={zIndex} 
                  onChange={(e) => setZIndex(parseInt(e.target.value) || 1)} 
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-admin-submit">💾 Publicar en Base de Datos</button>
        </form>
      </div>

    </div>
  );
}

export default SubirPrendaPage;
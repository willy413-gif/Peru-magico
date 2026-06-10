import "./App.css";
import {
  Routes,
  Route
} from "react-router-dom";
import Welcome from "./pages/bienvenida/Welcome";
import VestimentasPage from "./pages/juegos/vestir/VestimentasPage";
import SubirPrendaPage from "./pages/tools/SubirPrendaPage";
import { useLocation } from "react-router-dom";
import { useBot } from "./bot/BotContext";
import BotGuia from "./bot/BotGuia";
import { BOT_CONFIG } from "./bot/BotConfig";
import CuentosPage from "./pages/cuentos/CuentosPage";
import MenuJuegosPage from "./pages/menu/MenuJuegosPage";
import ComidaPage from "./pages/juegos/comida/ComidaPage";
import UbicarPage from "./pages/juegos/ubicar/UbicarPage";

function App() {

  const { mensaje } = useBot();

  const location = useLocation();

  const mostrarBotFlotante =
    location.pathname !== "/";

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/cuentos"
          element={<CuentosPage />}
        />

        <Route
          path="/juegos/2"
          element={<VestimentasPage />}
        />

        <Route
          path="/juegos/1"
          element={<ComidaPage />}
        />

        <Route
          path="/juegos/3"
          element={<UbicarPage />}
        />

        <Route
          path="/subir-vestimenta"
          element={<SubirPrendaPage />}
        />

        <Route
          path="/menu-juegos"
          element={<MenuJuegosPage />}
        />

      </Routes>

      {mostrarBotFlotante && (
        <BotGuia
          nombre={BOT_CONFIG.nombre}
          avatar={BOT_CONFIG.avatar}
          mensaje={mensaje}
        />
      )}
    </>
  );
}
export default App;
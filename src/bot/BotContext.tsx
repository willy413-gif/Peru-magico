/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
} from "react";

import { narrar } from "./BotService";

interface BotContextType {
  mensaje: string;
  hablar: (
    texto: string,
    idioma?: string,
    onEnd?: () => void
  ) => void;
}

const BotContext =
  createContext<BotContextType | null>(null);

export function BotProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [mensaje, setMensaje] =
    useState("");

  const hablar = (
    texto: string,
    idioma = "es-PE",
    onEnd?: () => void
  ) => {

    setMensaje(texto);

    narrar(
      texto,
      idioma,
      onEnd
    );
  };

    return (
      <BotContext.Provider
        value={{
          mensaje,
          hablar
        }}
      >
        {children}
      </BotContext.Provider>
    );
  }

export function useBot() {

  const context =
    useContext(BotContext);

  if (!context) {
    throw new Error(
      "useBot debe usarse dentro de BotProvider"
    );
  }

  return context;
}
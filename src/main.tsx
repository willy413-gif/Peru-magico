import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BotProvider } from "./bot/BotContext";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BotProvider>
        <App />
      </BotProvider>
    </BrowserRouter>
  </StrictMode>,
)

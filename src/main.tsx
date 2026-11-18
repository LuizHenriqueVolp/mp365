import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fontsource/cinzel/latin-600.css";
import "@fontsource/cinzel/latin-700.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-600.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "./index.css";
import Home from "./pages/Home";
import OfertaEspecial from "./pages/OfertaEspecial";
import Fuentes from "./pages/Fuentes";
import Gracias from "./pages/Gracias";
import UltimaOportunidad from "./pages/UltimaOportunidad";
import { Privacidad, Terminos } from "./pages/Legal";
import { captureAttribution } from "./lib/tracking";

captureAttribution();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oferta-especial" element={<OfertaEspecial />} />
        <Route path="/fuentes" element={<Fuentes />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/ultima-oportunidad" element={<UltimaOportunidad />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

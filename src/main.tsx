import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "@fontsource/jost/latin-600.css";
import "./index.css";
import Home from "./pages/Home";
import OfertaEspecial from "./pages/OfertaEspecial";
import Fuentes from "./pages/Fuentes";
import Gracias from "./pages/Gracias";
import UltimaOportunidad from "./pages/UltimaOportunidad";
import { Privacidad, Terminos } from "./pages/Legal";
import { captureAttribution, trackRouteView } from "./lib/tracking";

captureAttribution();

/** PageView ao trocar de rota dentro do site (o pushState automático do Meta está desligado). */
function RouteTracker() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    trackRouteView();
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteTracker />
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

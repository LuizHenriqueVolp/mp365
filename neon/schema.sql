-- Registro de eventos de la página de ventas (respaldo del pixel)
CREATE TABLE IF NOT EXISTS eventos (
  id           BIGSERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  event        TEXT NOT NULL,            -- view_content | section_view | checkout_click | upsell_view | upsell_decline | thank_you_view
  session_id   TEXT,
  path         TEXT,
  referrer     TEXT,
  utm_source   TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  src          TEXT, sck TEXT, fbclid TEXT,
  fbp          TEXT, fbc TEXT,
  device       TEXT, lang TEXT, screen TEXT,
  country      TEXT,
  ip_hash      TEXT,
  data         JSONB
);
CREATE INDEX IF NOT EXISTS eventos_created_idx ON eventos (created_at DESC);
CREATE INDEX IF NOT EXISTS eventos_event_idx ON eventos (event, created_at DESC);
CREATE INDEX IF NOT EXISTS eventos_campaign_idx ON eventos (utm_campaign, created_at DESC);

-- Embudo por día y campaña
CREATE OR REPLACE VIEW embudo_diario AS
SELECT date_trunc('day', created_at AT TIME ZONE 'America/Mexico_City')::date AS dia,
       coalesce(utm_campaign, '(sin campaña)') AS campana,
       count(DISTINCT session_id) FILTER (WHERE event = 'view_content')                       AS visitas,
       count(DISTINCT session_id) FILTER (WHERE event = 'section_view' AND data->>'name' = 'planes') AS vieron_planes,
       count(DISTINCT session_id) FILTER (WHERE event = 'checkout_click')                     AS clic_comprar,
       count(DISTINCT session_id) FILTER (WHERE event = 'checkout_click' AND data->>'plan' = 'completo') AS clic_completo,
       count(DISTINCT session_id) FILTER (WHERE event = 'checkout_click' AND data->>'plan' = 'basico')   AS clic_basico
FROM eventos GROUP BY 1, 2 ORDER BY 1 DESC, 3 DESC;

-- Hasta dónde llegan los visitantes (secciones vistas)
CREATE OR REPLACE VIEW scroll_secciones AS
SELECT data->>'name' AS seccion, count(DISTINCT session_id) AS sesiones
FROM eventos WHERE event = 'section_view' AND created_at > now() - interval '7 days'
GROUP BY 1 ORDER BY 2 DESC;

import React, { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Theme,
  Content,
  Grid,
  Column,
  Button,
  ButtonSet,
  TextInput,
  InlineLoading,
  Tag,
  Toggle,
  Loading,            // ⬅️ overlay loader
} from "@carbon/react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import ApiPage from "./pages/ApiPage.jsx";

// ---- Shared config ----
// Use Vite dev proxy locally; use Cloudflare Worker in production
const endpoint = import.meta.env.DEV
  ? "/ch-graphql/"
  : "https://proud-hat-1ce4.gnhkfc.workers.dev/ch-graphql/";

const displayEndpoint = "https://api.cooperhewitt.org/";

const DEFAULT_QUERY = `{
  object(hasImages:true, size:12, page:1) {
    id
    title
    summary
    date
    multimedia
  }
}`;

// ---- Layout: renders Carbon header on every route ----
function Layout({ theme, toggleTheme }) {
  return (
    <Theme theme={theme}>
      <HeaderBar theme={theme} toggleTheme={toggleTheme} />
      {/* Children render their own Content containers */}
      <Outlet />
    </Theme>
  );
}

// ---- Sandbox page (your editor + results) ----
function Sandbox({ theme }) {
  const monacoTheme = theme === "g90" ? "vs-dark" : "light";

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState(null);
  const [error, setError] = useState(null);

  // inputs -> when any are present we generate composedQuery
  const [maker, setMaker] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // compact density
  const [compact, setCompact] = useState(false);

  // Listen for "Load in editor" from The API page
  useEffect(() => {
    function onLoadPreset(e) {
      const preset = e?.detail;
      if (!preset) return;
      setMaker(""); setFrom(""); setTo("");
      setQuery(preset);
      setJson(null); setError(null);
      // To autorun, uncomment:
      // runQuery(preset);
    }
    window.addEventListener("ch:loadPreset", onLoadPreset);
    return () => window.removeEventListener("ch:loadPreset", onLoadPreset);
  }, []);

  const composedQuery = useMemo(() => {
    if (!maker && !from && !to) return query;
    const yr = from && to ? `yearRange:{from:${Number(from)}, to:${Number(to)}}` : "";
    const mk = maker ? `maker:"${maker.replace(/"/g, '\\"')}"` : "";
    const args = [mk, yr, "hasImages:true", "size:12"].filter(Boolean).join(", ");
    return `{
      object(${args}) {
        id
        title
        summary
        date
        multimedia
      }
    }`;
  }, [maker, from, to, query]);

  async function runQuery(qStr) {
    if (loading) return;           // ⬅️ prevent re-entrancy
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: qStr || composedQuery }),
      });
      const payload = await res.json();
      if (payload.errors) throw new Error(payload.errors.map((e) => e.message).join("\n"));
      setJson(payload.data);
    } catch (e) {
      setJson(null);
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    if (loading) return;           // avoid clearing mid-request
    setMaker(""); setFrom(""); setTo("");
    setQuery(DEFAULT_QUERY);
    setJson(null); setError(null);
  }

  return (
    <div data-carbon-density={compact ? "compact" : undefined}>
      {/* Full-page overlay while querying */}
      <Loading
        active={loading}
        withOverlay
        description="Querying Cooper Hewitt…"
      />

      <Content className="cds-page" style={{ paddingTop: "4rem" }}>
        <Grid condensed fullWidth className="cds-stack">
          <Column lg={8} md={8} sm={4}>
            <div className="cds-card">
              <div className="cds-controls">
                <TextInput
                  id="maker"
                  labelText="Maker"
                  value={maker}
                  onChange={(e) => setMaker(e.target.value)}
                  placeholder="e.g. Ikko Tanaka (leave blank to use editor)"
                  className="half"
                  disabled={loading}
                />
                <TextInput
                  id="from"
                  labelText="Year from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. 1960"
                  className="third"
                  disabled={loading}
                />
                <TextInput
                  id="to"
                  labelText="Year to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. 1969"
                  className="third"
                  disabled={loading}
                />
              </div>

              <div className="cds-actions">
                <ButtonSet>
                  <Button onClick={() => runQuery()} kind="primary" disabled={loading}>
                    {loading ? <InlineLoading description="Running..." /> : "Execute query"}
                  </Button>
                  <Button onClick={clearAll} kind="secondary" disabled={loading}>
                    Clear
                  </Button>
                </ButtonSet>

                <Toggle
                  id="density-toggle"
                  labelText="Compact"
                  size="sm"
                  hideLabel={false}
                  toggled={compact}
                  onToggle={(val) => setCompact(val)}
                  aria-label="Toggle compact density"
                  disabled={loading}
                />

                <Tag type="cool-gray">POST {displayEndpoint}</Tag>
              </div>
            </div>

            <div className="cds-card">
              <div className="cds-editor">
                <Editor
                  height="100%"
                  defaultLanguage="graphql"
                  value={composedQuery}
                  theme={monacoTheme}
                  onChange={(v) => !loading && setQuery(v ?? "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 2,
                    automaticLayout: true,
                    readOnly: loading,            // ⬅️ lock editor while loading
                  }}
                />
              </div>
            </div>
          </Column>

          <Column lg={8} md={8} sm={4}>
            <div className="cds-card">
              <h3 className="cds-heading">Results</h3>
              {error && <p style={{ color: "var(--cds-support-error)" }}>{error}</p>}
              {!error && !json && !loading && <p className="cds-subtle">Run a query to see results.</p>}
              {!error && json?.object?.length === 0 && <p className="cds-subtle">No results.</p>}

              {json?.object && (
                <div className="cds-grid" style={{ marginTop: "var(--cds-spacing-03)" }}>
                  {json.object.map((o) => {
                    // IMAGE URL (array/object/string friendly)
                    let src = o?.multimedia?.preview?.location;

                    if (!src && o?.multimedia) {
                      try {
                        const mm = typeof o.multimedia === "string" ? JSON.parse(o.multimedia) : o.multimedia;

                        if (Array.isArray(mm)) {
                          const m0 = mm[0];
                          if (m0?.preview) {
                            src = typeof m0.preview === "string" ? m0.preview : (m0.preview.url || m0.preview.location);
                          }
                          if (!src && m0?.large) {
                            src = typeof m0.large === "string" ? m0.large : (m0.large.url || m0.large.location);
                          }
                        }

                        if (!src && mm && typeof mm === "object") {
                          if (mm.preview) {
                            src = typeof mm.preview === "string" ? mm.preview : (mm.preview.url || mm.preview.location);
                          }
                          if (!src && mm.large) {
                            src = typeof mm.large === "string" ? mm.large : (mm.large.url || mm.large.location);
                          }
                          if (!src && mm.url) src = mm.url;
                          if (!src && mm.image) src = mm.image;
                        }
                      } catch {}
                    }

                    const titleText =
                      o?.summary?.title ??
                      (Array.isArray(o?.title) ? o.title[0]?.value : o?.title) ??
                      o?.id;

                    const yearText =
                      Array.isArray(o?.date) && o.date[0]?.value
                        ? `, ${o.date[0].value}`
                        : o?.date ? `, ${o.date}` : "";

                    return (
                      <figure key={o.id} className="cds-figure cds-card-tile">
                        {src ? (
                          <img src={src.startsWith("http") ? src : `https:${src}`} alt={titleText} className="cds-thumb" />
                        ) : (
                          <div className="cds-thumb cds-thumb--placeholder">no image</div>
                        )}
                        <figcaption className="cds-figcaption">
                          {titleText}{yearText}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="cds-card">
              <h3 className="cds-heading">Raw JSON</h3>
              <pre className="cds-json">{json ? JSON.stringify(json, null, 2) : "{}"}</pre>
            </div>
          </Column>
        </Grid>
      </Content>
    </div>
  );
}

// ---- App with routes ----
export default function App() {
  // Keep theme at the top so HeaderBar can toggle on any page
  const [theme, setTheme] = useState("g10");
  const toggleTheme = () => setTheme((t) => (t === "g10" ? "g90" : "g10"));

  return (
    <Routes>
      <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
        <Route path="/" element={<Sandbox theme={theme} />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
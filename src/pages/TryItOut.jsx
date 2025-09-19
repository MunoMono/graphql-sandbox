// src/pages/TryItOut.jsx
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Grid,
  Column,
  Heading,
  Button,
  ButtonSet,
  InlineLoading,
  Tag,
  Toggle,
  Loading,
  Theme,
} from "@carbon/react";
import { useLocation, useNavigate } from "react-router-dom";

// Use Vite dev proxy locally; Cloudflare Worker in prod
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

export default function TryItOut() {
  const location = useLocation();
  const navigate = useNavigate();

  // Keep Monaco in sync with Carbon theme
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("cds-theme-g90")
  );
  useEffect(() => {
    const mo = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("cds-theme-g90"))
    );
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => mo.disconnect();
  }, []);
  const monacoTheme = isDark ? "vs-dark" : "light";

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState(null);
  const [error, setError] = useState(null);
  const [compact, setCompact] = useState(false);

  // 1) Accept legacy broadcast if both pages are mounted
  useEffect(() => {
    function onLoadPreset(e) {
      const preset = e?.detail;
      if (!preset) return;
      setQuery(preset);
      setJson(null);
      setError(null);
      // Optionally auto-run:
      // runQuery(preset);
    }
    window.addEventListener("ch:loadPreset", onLoadPreset);
    return () => window.removeEventListener("ch:loadPreset", onLoadPreset);
  }, []);

  // 2) Accept route state when arriving from /snippets
  useEffect(() => {
    const preset = location.state?.preset;
    if (preset) {
      setQuery(preset);
      setJson(null);
      setError(null);
      // clear preset from history so refreshes don't reapply it
      navigate(location.pathname, { replace: true, state: null });
      // Optionally auto-run:
      // runQuery(preset);
    }
  }, [location.state, location.pathname, navigate]);

  async function runQuery(qStr) {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: qStr || query }),
      });
      const payload = await res.json();
      if (payload.errors)
        throw new Error(payload.errors.map((e) => e.message).join("\n"));
      setJson(payload.data);
    } catch (e) {
      setJson(null);
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    if (loading) return;
    setQuery(DEFAULT_QUERY);
    setJson(null);
    setError(null);
  }

  return (
    <>
      <div className="page-header">
        <Grid fullWidth>
          <Column lg={10} md={8} sm={4}>
            <Heading type="heading-03">Try it out</Heading>
          </Column>
        </Grid>
      </div>

      <Theme theme="g10">
        <section className="docs-panel-band">
          <div className="docs-panel-band__inner">
            <Loading
              active={loading}
              withOverlay
              description="Querying Cooper Hewitt…"
            />

            <Grid condensed fullWidth className="cds-stack" style={{ marginTop: "1rem" }}>
              <Column lg={8} md={8} sm={4}>
                <div className="cds-card">
                  <div className="cds-actions">
                    <ButtonSet>
                      <Button onClick={() => runQuery()} kind="primary" disabled={loading}>
                        {loading ? (
                          <InlineLoading description="Running..." />
                        ) : (
                          "Execute query"
                        )}
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
                      value={query}
                      theme={monacoTheme}
                      onChange={(v) => !loading && setQuery(v ?? "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        tabSize: 2,
                        automaticLayout: true,
                        readOnly: loading,
                      }}
                    />
                  </div>
                </div>
              </Column>

              <Column lg={8} md={8} sm={4}>
                <div className="cds-card">
                  <h3 className="cds-heading">Results</h3>
                  {error && (
                    <p style={{ color: "var(--cds-support-error)" }}>{error}</p>
                  )}
                  {!error && !json && !loading && (
                    <p className="cds-subtle">Run a query to see results.</p>
                  )}
                  {!error && json?.object?.length === 0 && (
                    <p className="cds-subtle">No results.</p>
                  )}

                  {json?.object && (
                    <div
                      className="cds-grid"
                      style={{ marginTop: "var(--cds-spacing-03)" }}
                    >
                      {json.object.map((o) => {
                        let src = o?.multimedia?.preview?.location;

                        if (!src && o?.multimedia) {
                          try {
                            const mm =
                              typeof o.multimedia === "string"
                                ? JSON.parse(o.multimedia)
                                : o.multimedia;

                            if (Array.isArray(mm)) {
                              const m0 = mm[0];
                              if (m0?.preview) {
                                src =
                                  typeof m0.preview === "string"
                                    ? m0.preview
                                    : m0.preview.url || m0.preview.location;
                              }
                              if (!src && m0?.large) {
                                src =
                                  typeof m0.large === "string"
                                    ? m0.large
                                    : m0.large.url || m0.large.location;
                              }
                            }

                            if (!src && mm && typeof mm === "object") {
                              if (mm.preview) {
                                src =
                                  typeof mm.preview === "string"
                                    ? mm.preview
                                    : mm.preview.url || mm.preview.location;
                              }
                              if (!src && mm.large) {
                                src =
                                  typeof mm.large === "string"
                                    ? mm.large
                                    : mm.large.url || mm.large.location;
                              }
                              if (!src && mm.url) src = mm.url;
                              if (!src && mm.image) src = mm.image;
                            }
                          } catch {}
                        }

                        const titleText =
                          o?.summary?.title ??
                          (Array.isArray(o?.title)
                            ? o.title[0]?.value
                            : o?.title) ??
                          o?.id;

                        const yearText =
                          Array.isArray(o?.date) && o.date[0]?.value
                            ? `, ${o.date[0].value}`
                            : o?.date
                            ? `, ${o?.date}`
                            : "";

                        return (
                          <figure key={o.id} className="cds-figure cds-card-tile">
                            {src ? (
                              <img
                                src={src.startsWith("http") ? src : `https:${src}`}
                                alt={titleText}
                                className="cds-thumb"
                              />
                            ) : (
                              <div className="cds-thumb cds-thumb--placeholder">
                                no image
                              </div>
                            )}
                            <figcaption className="cds-figcaption">
                              {titleText}
                              {yearText}
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="cds-card">
                  <h3 className="cds-heading">Raw JSON</h3>
                  <pre className="cds-json">
                    {json ? JSON.stringify(json, null, 2) : "{}"}
                  </pre>
                </div>
              </Column>
            </Grid>
          </div>
        </section>
      </Theme>
    </>
  );
}
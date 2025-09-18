// src/pages/ApiPage.jsx
import React from "react";
import { Button, Tag } from "@carbon/react";

const PRESETS = {
  tanaka: `{
  object(maker:"Ikko Tanaka", general:"poster", hasImages:true, size:12, page:1){
    id title summary date multimedia
  }
}`,
  yokoo: `{
  object(maker:"Tadanori Yokoo", general:"poster", hasImages:true, size:12){
    id title summary date multimedia
  }
}`,
  fukuda: `{
  object(maker:"Shigeo Fukuda", general:"poster", hasImages:true, size:12){
    id title summary date multimedia
  }
}`,
  kamekura: `{
  object(maker:"Yusaku Kamekura", general:"poster", hasImages:true, size:12){
    id title summary date multimedia
  }
}`,
  nagai: `{
  object(maker:"Kazumasa Nagai", general:"poster", hasImages:true, size:12){
    id title summary date multimedia
  }
}`,
};

// Dispatch a custom event the Sandbox listens for
function loadInEditor(query) {
  window.dispatchEvent(new CustomEvent("ch:loadPreset", { detail: query }));
}

export default function ApiPage() {
  return (
    <div className="cds-page" style={{ paddingTop: "4rem" }}>
      <div className="cds-card">
        <h2 className="cds-heading">The API</h2>
        <p className="cds-subtle">
          Notes inspired by the Cooper Hewitt docs with one-click examples that load straight into the Sandbox editor.
        </p>
        <Tag type="cool-gray">Source: Cooper Hewitt GraphQL</Tag>
      </div>

      {/* 1. Getting Started */}
      <div className="cds-card">
        <h3 className="cds-heading">1) Getting Started</h3>
        <p>Query the endpoint and request only the fields you need. Objects are paged.</p>
        <pre className="cds-json">{`{
  object(size:12, page:1) { id title summary }
}`}</pre>
        <Button kind="primary" onClick={() => loadInEditor(PRESETS.tanaka)}>Load in editor</Button>
      </div>

      {/* 2. Images and other media */}
      <div className="cds-card">
        <h3 className="cds-heading">2) Images and other media</h3>
        <p>Filter to records with images using <code>hasImages:true</code>. The <code>multimedia</code> field includes preview/large URLs.</p>
        <pre className="cds-json">{`{
  object(hasImages:true, size:12) { id title multimedia }
}`}</pre>
        <Button kind="primary" onClick={() => loadInEditor(PRESETS.yokoo)}>Load in editor</Button>
      </div>

      {/* 3. Search for objects */}
      <div className="cds-card">
        <h3 className="cds-heading">3) Search for objects</h3>
        <p>Use <code>maker</code>, <code>general</code>, and <code>yearRange</code> to narrow results.</p>
        <pre className="cds-json">{`{
  object(maker:"Ikko Tanaka", general:"poster", hasImages:true, size:12) {
    id title date multimedia
  }
}`}</pre>
        <Button kind="primary" onClick={() => loadInEditor(PRESETS.tanaka)}>Load in editor</Button>
      </div>

      {/* 4. Sorting & Pagination */}
      <div className="cds-card">
        <h3 className="cds-heading">4) Sorting & Pagination</h3>
        <p>
          Use <code>page</code> + <code>size</code> for pagination. (Keep query depth ≤ 2.)
        </p>
        <pre className="cds-json">{`{
  object(maker:"Shigeo Fukuda", general:"poster", hasImages:true, size:12, page:2){
    id title date multimedia
  }
}`}</pre>
        <Button kind="primary" onClick={() => loadInEditor(PRESETS.fukuda)}>Load in editor</Button>
      </div>

      {/* 5. Designer presets */}
      <div className="cds-card">
        <h3 className="cds-heading">5) Designer presets</h3>
        <p>Explore well-represented Japanese poster designers:</p>
        <div style={{ display:"flex", gap:"var(--cds-spacing-03)", flexWrap:"wrap" }}>
          <Button kind="tertiary" onClick={() => loadInEditor(PRESETS.tanaka)}>Ikko Tanaka</Button>
          <Button kind="tertiary" onClick={() => loadInEditor(PRESETS.yokoo)}>Tadanori Yokoo</Button>
          <Button kind="tertiary" onClick={() => loadInEditor(PRESETS.fukuda)}>Shigeo Fukuda</Button>
          <Button kind="tertiary" onClick={() => loadInEditor(PRESETS.kamekura)}>Yusaku Kamekura</Button>
          <Button kind="tertiary" onClick={() => loadInEditor(PRESETS.nagai)}>Kazumasa Nagai</Button>
        </div>
      </div>
    </div>
  );
}
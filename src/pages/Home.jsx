import React, { useEffect, useState } from "react";
import { Grid, Column, Heading } from "@carbon/react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [md, setMd] = useState("Loading…");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}docs/home.md`);
        setMd(res.ok ? await res.text() : "Could not load markdown.");
      } catch {
        setMd("Could not load markdown.");
      }
    })();
  }, []);

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <Heading type="heading-03">Cooper Hewitt · GraphQL Sandbox</Heading>
        </div>
      </div>

      {/* Page content */}
      <section className="docs-panel-band">
        <div className="docs-panel-band__inner">
          <Grid fullWidth className="docs-content__grid">
            <Column lg={10} md={8} sm={4}>
              <div className="cds-card">
                <div className="carbon-markdown">
                  <ReactMarkdown
                    components={{
                      ul: ({ node, ...props }) => <ul {...props} />,
                      li: ({ node, ...props }) => <li {...props} />,
                    }}
                  >
                    {md}
                  </ReactMarkdown>
                </div>
              </div>
            </Column>
          </Grid>
        </div>
      </section>
    </>
  );
}
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
      <div className="page-header">
        <Grid fullWidth>
          <Column lg={10} md={8} sm={4}>
            <Heading type="heading-03">Cooper Hewitt · GraphQL Sandbox</Heading>
          </Column>
        </Grid>
      </div>

      <section className="docs-panel-band">
        <div className="docs-panel-band__inner">
          <Grid fullWidth>
            <Column lg={10} md={8} sm={4}>
              <div className="cds-card">
                <div className="carbon-markdown">
                  <ReactMarkdown>{md}</ReactMarkdown>
                </div>
              </div>
            </Column>
          </Grid>
        </div>
      </section>
    </>
  );
}
import React from "react";
import mermaid from "mermaid";

export default function Mermaid({ id, chart }: { id: string; chart: string }) {
  return (
    <div
      ref={(node) => {
        if (node == null) {
          return;
        }
        mermaid.mermaidAPI.render(id, chart, (svgCode) => {
          node.innerHTML = svgCode;
        });
      }}
    ></div>
  );
}

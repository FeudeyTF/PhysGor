import { useEffect, useRef } from "react";
import { parseFormula } from "./FormulaParser";
import "../styles/components/RichTextRenderer.scss";

type RichTextRendererProps = {
  html: string;
  className?: string;
};

export function RichTextRenderer(props: RichTextRendererProps) {
  const { html, className = "" } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = html;

      const formulaElements =
        containerRef.current.querySelectorAll(".formula-wrapper");

      formulaElements.forEach((element) => {
        const formulaText = element.getAttribute("data-formula");
        if (formulaText) {
          const formulaDisplay = document.createElement("span");
          formulaDisplay.className = "formula-display";
          formulaDisplay.innerHTML = parseFormula(formulaText);

          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }

          element.appendChild(formulaDisplay);
        }
      });
    }
  }, [html]);

  return (
    <div ref={containerRef} className={`rich-text-renderer ${className}`} />
  );
}

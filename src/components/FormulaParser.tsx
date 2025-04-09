import { useState, useEffect } from "react";
import "../styles/components/FormulaParser.scss";

type FormulaParserProps = {
  formula: string;
  className?: string;
};

export function FormulaParser(props: FormulaParserProps) {
  const { formula, className } = props;
  const [parsedFormula, setParsedFormula] = useState<string>("");

  useEffect(() => {
    setParsedFormula(parseFormula(formula));
  }, [formula]);

  return (
    <div className={`formula-parser ${className}`}>
      <div
        className={`formula-content ${className}`}
        dangerouslySetInnerHTML={{ __html: parsedFormula }}
      />
    </div>
  );
}

function processNestedExpressions(input: string) {
  let result = input;
  let lastResult = "";

  while (result !== lastResult) {
    lastResult = result;

    result = result.replace(
      /\(([^()]+)\/([^()]+)\)/g,
      '<span class="formula-fraction"><span class="formula-numerator">$1</span><span class="formula-denominator">$2</span></span>'
    );

    result = result.replace(
      /([a-zA-Z0-9_\\]+)\/([a-zA-Z0-9_\\]+)(?![a-zA-Z0-9_\\])/g,
      '<span class="formula-fraction"><span class="formula-numerator">$1</span><span class="formula-denominator">$2</span></span>'
    );
  }

  return result;
}

function applyTransformations(input: string) {
  return (
    input
      // Подстрочные символы (x_a, x_1, и т.д.)
      .replace(
        /([a-zA-Z0-9])_([a-zA-Z0-9]+)/g,
        '$1<span class="formula-subscript">$2</span>'
      )

      // Надстрочные символы (x^a, x^2, и т.д..)
      .replace(
        /([a-zA-Z0-9])\^([a-zA-Z0-9]+)/g,
        '$1<span class="formula-superscript">$2</span>'
      )

      // Греческие буквы
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\zeta/g, "ζ")
      .replace(/\\eta/g, "η")
      .replace(/\\theta/g, "θ")
      .replace(/\\iota/g, "ι")
      .replace(/\\kappa/g, "κ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\nu/g, "ν")
      .replace(/\\xi/g, "ξ")
      .replace(/\\omicron/g, "ο")
      .replace(/\\pi/g, "π")
      .replace(/\\rho/g, "ρ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\tau/g, "τ")
      .replace(/\\upsilon/g, "υ")
      .replace(/\\phi/g, "φ")
      .replace(/\\chi/g, "χ")
      .replace(/\\psi/g, "ψ")
      .replace(/\\omega/g, "ω")
      // Заглавные греческие буквы
      .replace(/\\Alpha/g, "Α")
      .replace(/\\Beta/g, "Β")
      .replace(/\\Gamma/g, "Γ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Epsilon/g, "Ε")
      .replace(/\\Zeta/g, "Ζ")
      .replace(/\\Eta/g, "Η")
      .replace(/\\Theta/g, "Θ")
      .replace(/\\Iota/g, "Ι")
      .replace(/\\Kappa/g, "Κ")
      .replace(/\\Lambda/g, "Λ")
      .replace(/\\Mu/g, "Μ")
      .replace(/\\Nu/g, "Ν")
      .replace(/\\Xi/g, "Ξ")
      .replace(/\\Omicron/g, "Ο")
      .replace(/\\Pi/g, "Π")
      .replace(/\\Rho/g, "Ρ")
      .replace(/\\Sigma/g, "Σ")
      .replace(/\\Tau/g, "Τ")
      .replace(/\\Upsilon/g, "Υ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\Chi/g, "Χ")
      .replace(/\\Psi/g, "Ψ")
      .replace(/\\Omega/g, "Ω")
      // Математические символы
      .replace(/\\infty/g, "∞")
      .replace(/\\approx/g, "≈")
      .replace(/\\neq/g, "≠")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\pm/g, "±")
      .replace(/\\mp/g, "∓")
      .replace(/\\partial/g, "∂")
      .replace(/\\nabla/g, "∇")
      .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
      .replace(/\\cdot/g, "·")
      .replace(/\\int/g, "∫")
      .replace(/\\sum/g, "∑")
      .replace(/\\prod/g, "∏")
  );
}

function parseFormula(input: string) {
  if (!input) {
    return "";
  }
  let result = processNestedExpressions(input);
  result = applyTransformations(result);
  return result;
}

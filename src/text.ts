const replacements: Array<[RegExp, string]> = [
  [/\\times/g, "×"],
  [/\\div/g, "÷"],
  [/\\cdot/g, "·"],
  [/\\pm/g, "±"],
  [/\\leq?/g, "≤"],
  [/\\geq?/g, "≥"],
  [/\\neq?/g, "≠"],
  [/\\approx/g, "≈"],
  [/\\blacktriangle/g, "▲"],
  [/\\triangle/g, "△"],
  [/\\blacksquare/g, "■"],
  [/\\square/g, "□"],
  [/\\bigcirc/g, "○"],
  [/\\circ/g, "○"],
  [/\\bullet/g, "•"],
  [/\\hline\b/g, ""],
  [/\\quad\b|\\qquad\b|\\enspace\b|\\thinspace\b/g, " "],
  [/\\,|\\;|\\:|\\!/g, " "],
  [/\\left/g, ""],
  [/\\right/g, ""],
  [/\\begin\{[^}]+\}(?:\{[^}]+\})?/g, ""],
  [/\\end\{[^}]+\}/g, ""],
];

export function formatMathText(value?: string | null) {
  if (!value) return "";

  let text = value
    .replace(/<[^>]*>/g, "")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^{}]+)\}/g, "$1")
    .replace(/\\operatorname\{([^{}]+)\}/g, "$1")
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/\$/g, "")
    .replace(/\\\\/g, "\n");

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  return text
    .replace(/[ \t]*&[ \t]*(?==)/g, " ")
    .replace(/&/g, "")
    .replace(/\\([{}])/g, "$1")
    .replace(/\\([#$%&_])/g, "$1")
    .replace(/\\(?=[A-Za-z])/g, "")
    .replace(/[ \t]+([+\-×÷=<>≤≥≠≈])/g, " $1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

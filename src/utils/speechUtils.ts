/**
 * Transforms written markdown, structured papers, formulas, and technical outputs
 * into natural, conversational, lifelike human speech for the Voice HUD assistant.
 * Eliminates essay drone, section headers, bullet lists, and robotic symbols.
 */
export function cleanTextForSpeech(raw: string): string {
  if (!raw || !raw.trim()) return "";

  let text = raw.trim();

  // 1. EXTRACT CORE CONVERSATIONAL ESSENCE (Avoid reading whole essay or document)
  const directAnswerMatch = text.match(/(?:###|\*\*|#)?\s*Direct Answer:?\s*([\s\S]*?)(?:####|###|\n\n\n|\n-|\n1\.|$)/i);
  if (directAnswerMatch && directAnswerMatch[1].trim()) {
    text = directAnswerMatch[1].trim();
  } else {
    const tldrMatch = text.match(/(?:\*\*|#)?\s*(?:TL;DR|Quick Summary):?\s*([\s\S]*?)(?:####|###|\n\n\n|$)/i);
    if (tldrMatch && tldrMatch[1].trim()) {
      text = tldrMatch[1].trim();
    } else {
      const cutoffIdx = text.search(/####|###|\*\*Key Principles|\*\*Step-by-Step|\*\*Derivation/i);
      if (cutoffIdx > 40) {
        text = text.slice(0, cutoffIdx).trim();
      }
    }
  }

  // 2. STRIP ESSAY HEADERS, BULLET NUMBERS, CITATIONS, AND METADATA
  text = text.replace(/^#+\s+/gm, "");
  text = text.replace(/\*\*[^*]+\*\*:/g, ""); // strip bold category labels like **Step 1:**
  text = text.replace(/\(\$[a-zA-Z_0-9\\]+\$\)/g, ""); // strip parenthetical variable notation like ($n$) or ($E_k$)
  text = text.replace(/\([a-zA-Z]\)/g, ""); // strip single letter parens like (n) or (g)
  text = text.replace(/[*_~`#]/g, "");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/^[\s\t]*[\d\-\*\+]+[\.\)]\s+/gm, ""); // strip "1.", "2)", "-", etc.
  text = text.replace(/```[\s\S]*?```/g, ""); // remove code blocks
  text = text.replace(/https?:\/\/\S+/g, ""); // remove URLs
  text = text.replace(/\(Eq(?:uation)?\.?\s*\d+\.?\d*\)/gi, ""); // strip (Eq. 1)
  text = text.replace(/\\checkmark/gi, "");

  // 3. TRANSLATE MATH AND LATEX INTO SMOOTH CONVERSATIONAL SPOKEN ENGLISH
  text = text.replace(/E_k\s*=\s*\\frac\{1\}\{2\}\s*m\s*v\^2/gi, "kinetic energy equals one-half m v squared");
  text = text.replace(/E\s*=\s*m\s*c\^2/gi, "E equals m c squared");
  text = text.replace(/F\s*=\s*m\s*a/gi, "force equals mass times acceleration");
  text = text.replace(/v\s*=\s*u\s*\+\s*a\s*t/gi, "v equals u plus a t");
  text = text.replace(/a\^2\s*\+\s*b\^2\s*=\s*c\^2/gi, "a squared plus b squared equals c squared");
  text = text.replace(/\\pi\s*\\approx\s*3\.14[0-9]*/gi, "pi is approximately 3.14");

  // Fractions
  text = text.replace(/\\frac\{1\}\{2\}/g, "one half");
  text = text.replace(/\\frac\{1\}\{3\}/g, "one third");
  text = text.replace(/\\frac\{1\}\{4\}/g, "one quarter");
  text = text.replace(/\\frac\{3\}\{4\}/g, "three quarters");
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2");

  // Powers and Exponents
  text = text.replace(/([a-zA-Z0-9]+)\^2/g, "$1 squared");
  text = text.replace(/([a-zA-Z0-9]+)\^3/g, "$1 cubed");
  text = text.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, "$1 to the power of $2");

  // Square roots
  text = text.replace(/\\sqrt\{([^}]+)\}/g, "square root of $1");

  // Subscripts & Greek Variables
  text = text.replace(/E_k/gi, "kinetic energy");
  text = text.replace(/E_p/gi, "potential energy");
  text = text.replace(/v_0/gi, "initial velocity");
  text = text.replace(/([a-zA-Z])_([0-9a-zA-Z]+)/g, "$1 sub $2");
  text = text.replace(/\\approx|\\sim/g, " is about ");
  text = text.replace(/\\times|\\cdot/g, " times ");
  text = text.replace(/\\div/g, " divided by ");
  text = text.replace(/\\pm/g, " plus or minus ");
  text = text.replace(/\\le(?:q)?/g, " less than or equal to ");
  text = text.replace(/\\ge(?:q)?/g, " greater than or equal to ");
  text = text.replace(/\\neq/g, " does not equal ");
  text = text.replace(/\\implies/g, " which means ");
  text = text.replace(/\\theta/gi, " theta ");
  text = text.replace(/\\lambda/gi, " lambda ");
  text = text.replace(/\\omega/gi, " omega ");
  text = text.replace(/\\alpha/gi, " alpha ");
  text = text.replace(/\\beta/gi, " beta ");
  text = text.replace(/\\gamma/gi, " gamma ");
  text = text.replace(/\\hbar/gi, " h-bar ");
  text = text.replace(/\\psi/gi, " psi ");
  text = text.replace(/\\Delta/g, " delta ");
  text = text.replace(/\\pi/gi, " pi ");
  text = text.replace(/\\int/g, " integral of ");
  text = text.replace(/\\partial/g, " partial derivative of ");
  text = text.replace(/\\sum/g, " sum of ");
  text = text.replace(/\\infty/g, " infinity ");
  text = text.replace(/\\quad|\\qquad|\\text\{[^}]*\}|\\[a-zA-Z]+/g, " ");

  // Strip math delimiters $ and $$
  text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");
  text = text.replace(/\$([^$]+)\$/g, " $1 ");
  text = text.replace(/[\$\{\}\[\]\\]/g, "");

  // 4. ELIMINATE ESSAY TRANSITIONS & CLICHES
  text = text.replace(/\b(?:In conclusion|To systematically derive this|We now proceed|Key principles|Operands|Binary operator|Concluded result|Step \d+)\b:?/gi, "");
  text = text.replace(/\b(?:sir:)\b/gi, "sir,");

  // 5. HUMAN CONVERSATIONAL PACING & LENGTH CONSTRAINT
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\s+([,\.!?:;])/g, "$1");
  text = text.replace(/([,\.!?:;]){2,}/g, "$1");
  text = text.trim();

  // Pick the first 1 to 2 complete sentences for a natural spoken breath (approx 200 chars)
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let combined = "";
    for (const s of sentences) {
      if ((combined + s).length < 240) {
        combined += (combined ? " " : "") + s.trim();
      } else {
        break;
      }
    }
    text = combined || sentences[0].trim();
  }

  // Fallback cap if no sentence boundary
  if (text.length > 260) {
    text = text.slice(0, 250).replace(/\s+\S*$/, "") + ".";
  }

  // 6. ENSURE THE SPOKEN OUTPUT SAYS "SIR" EVERY TIME
  let cleanedFinal = text.trim();
  if (cleanedFinal && !/\bsir\b/i.test(cleanedFinal)) {
    if (/^(?:yes|certainly|here is|here are|right away)\b/i.test(cleanedFinal)) {
      cleanedFinal = cleanedFinal.replace(/^(yes|certainly|here is|here are|right away)[,\s]*/i, "$1, sir, ");
    } else {
      cleanedFinal = `Certainly, sir. ${cleanedFinal}`;
    }
  }

  return cleanedFinal.trim();
}

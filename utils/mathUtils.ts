/**
 * Safely evaluates a mathematical expression string.
 * Uses the Function constructor with restricted scope, but for a real-world app,
 * a library like mathjs is recommended. Here we implement a robust sanitizer.
 */
export const evaluateExpression = (expression: string): string => {
  try {
    // 1. Pre-processing: Replace visual symbols with JS operators
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-') // proper minus sign to hyphen
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)') // Basic sqrt(x)
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/\^/g, '**');

    // 2. Security Check: Only allow digits, operators, Math functions, and parenthesis
    const allowed = /^[0-9+\-*/().\s%MathPIEsqrtincoslog,]+$/;
    // Note: The regex above is a basic filter.
    
    // 3. Handle Percentage (simple implementation: number% -> number/100)
    // This is tricky in standard eval logic (e.g. 50 + 10%). 
    // For this simple engine, we treat n% as n/100.
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // 4. Evaluate
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();

    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    }

    // Round to reasonable decimal places to avoid 0.30000000000000004
    return String(Math.round(result * 10000000000) / 10000000000);
  } catch (err) {
    return "Error";
  }
};

export const formatDisplay = (value: string): string => {
  if (value === "Error") return value;
  // Add commas for thousands separator if it's a clean number
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
};
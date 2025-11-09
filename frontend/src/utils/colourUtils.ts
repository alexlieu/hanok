export function getCssVariableValue(variableName: string) {
  const element = document.documentElement;
  const styles = getComputedStyle(element);
  return styles.getPropertyValue(variableName).trim();
}

// Type definition for our internal color object
interface Color {
  r: number;
  g: number;
  b: number;
  a: number; // Alpha channel, from 0 to 1. -1 means not present.
}

/**
 * Parses a color string (HEX, RGB, RGBA) into a Color object.
 * @param colorStr The color string to parse.
 * @returns A Color object or undefined if parsing fails.
 */
function parseColor(colorStr: string): Color | undefined {
  if (!colorStr) return undefined;

  // For RGB or RGBA strings
  if (colorStr.startsWith("rgb")) {
    const parts = colorStr.match(/-?\d+(\.\d+)?/g);
    if (!parts || parts.length < 3) return undefined;

    return {
      r: parseInt(parts[0], 10),
      g: parseInt(parts[1], 10),
      b: parseInt(parts[2], 10),
      a: parts.length > 3 ? parseFloat(parts[3]) : -1,
    };
  }

  // For HEX strings
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);

    // Expand shorthand form (e.g. "03F")
    if (hex.length < 6) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const value = parseInt(hex, 16);

    // Handle different hex lengths (with/without alpha)
    if (hex.length === 8) {
      return {
        r: (value >> 24) & 255,
        g: (value >> 16) & 255,
        b: (value >> 8) & 255,
        a: (value & 255) / 255,
      };
    } else {
      return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
        a: -1,
      };
    }
  }

  return undefined;
}

/**
 * Tints, shades, or blends a color, based on the famous pSBC function.
 * @see https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 * @param percent A value from -1.0 (shade) to 1.0 (tint/blend).
 * @param fromColor The base color string (HEX or RGB).
 * @param toColor Optional. The color to blend with. If not provided, will tint (to white) or shade (to black).
 * @param useLinear Optional. If true, uses linear interpolation. Otherwise, uses a perceptual (squared) method.
 * @returns The resulting color as a string in the same format as the input, or undefined on error.
 */
export function shadeOrBlendColor(
  percent: number,
  fromColor: string,
  toColor: string | null = null,
  useLinear: boolean = false
): string | undefined {
  // 1. Validate inputs
  if (
    percent < -1 ||
    percent > 1 ||
    typeof fromColor !== "string" ||
    (toColor && typeof toColor !== "string")
  ) {
    return undefined;
  }

  // 2. Parse colors into objects
  const from = parseColor(fromColor);
  if (!from) return undefined;

  const isShade = percent < 0;
  const p = isShade ? percent * -1 : percent;
  const P = 1 - p;

  // 3. Determine the "to" color (white for tint, black for shade, or the provided color)
  const to = parseColor(toColor || (isShade ? "#000000" : "#FFFFFF"));
  if (!to) return undefined;

  // 4. Perform the color blending calculation
  let r, g, b;
  if (useLinear) {
    r = Math.round(P * from.r + p * to.r);
    g = Math.round(P * from.g + p * to.g);
    b = Math.round(P * from.b + p * to.b);
  } else {
    // Perceptual (squared) blending
    r = Math.round(Math.sqrt(P * from.r ** 2 + p * to.r ** 2));
    g = Math.round(Math.sqrt(P * from.g ** 2 + p * to.g ** 2));
    b = Math.round(Math.sqrt(P * from.b ** 2 + p * to.b ** 2));
  }

  // 5. Calculate the new alpha channel
  const hasAlpha = from.a !== -1 || (to && to.a !== -1);
  let a = 0;
  if (hasAlpha) {
    const fromA = from.a < 0 ? 1 : from.a;
    const toA = to.a < 0 ? 1 : to.a;
    a = fromA * P + toA * p;
  }

  // 6. Format the output string to match the input format
  const isRgbOutput = fromColor.startsWith("rgb");
  if (isRgbOutput) {
    const alphaStr = hasAlpha ? `,${Math.round(a * 1000) / 1000}` : "";
    const prefix = hasAlpha ? "rgba(" : "rgb(";
    return `${prefix}${r},${g},${b}${alphaStr})`;
  } else {
    const alphaHex = hasAlpha
      ? (Math.round(a * 255) | (1 << 8)).toString(16).slice(1)
      : "";
    const colorHex =
      (r | (1 << 8)).toString(16).slice(1) +
      (g | (1 << 8)).toString(16).slice(1) +
      (b | (1 << 8)).toString(16).slice(1);
    return `#${colorHex}${alphaHex}`;
  }
}

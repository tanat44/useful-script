import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function floatToHex(value: number): string {
  const color = hsl2rgb(value, 1.0, 0.5)

  function ensureTwoDigit(v: number) {
    const x = v.toString(16)
    if (x.length === 2) return x
    return "0" + x
  }

  return `#${ensureTwoDigit(color.r)}${ensureTwoDigit(color.g)}${ensureTwoDigit(color.b)}`
}

export function hsl2rgb(h: number, s: number, l: number) {
  let r, g, b, q, p

  if (s == 0) {
    r = g = b = l
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t++
      if (t > 1) t--
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    q = l < 0.5 ? l * (1 + s) : l + s - l * s
    p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  console.log(h, s, l)
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

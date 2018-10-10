import { map } from 'lodash'

const rgb2hex = (r, g, b) => {
  if (r === null || typeof r === 'undefined') {
    return undefined
  }
  if (r[0] === '#') {
    return r
  }
  if (typeof r === 'object') {
    ({ r, g, b } = r)
  }
  [r, g, b] = map([r, g, b], (val) => {
    val = Math.ceil(val)
    val = val < 0 ? 0 : val
    val = val > 255 ? 255 : val
    return val
  })
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Converts 8-bit RGB component into linear component
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/relative-luminance.xml
 * https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
 *
 * @param {Number} bit - color component [0..255]
 * @returns {Number} linear component [0..1]
 */
const c2linear = (bit) => {
  // W3C gives 0.03928 while wikipedia states 0.04045
  // what those magical numbers mean - I don't know.
  // something about gamma-correction, i suppose.
  // Sticking with W3C example.
  const c = bit / 255
  if (c < 0.03928) {
    return c / 12.92
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4)
  }
}

/**
 * Converts sRGB into linear RGB
 * @param {Object} srgb - sRGB color
 * @returns {Object} linear rgb color
 */
const srgbToLinear = (srgb) => {
  return 'rgb'.split('').reduce((acc, c) => { acc[c] = c2linear(srgb[c]); return acc }, {})
}

/**
 * Calculates relative luminance for given color
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/relative-luminance.xml
 *
 * @param {Object} srgb - sRGB color
 * @returns {Number} relative luminance
 */
const relativeLuminance = (srgb) => {
  const {r, g, b} = srgbToLinear(srgb)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Generates color ratio between two colors. Order is unimporant
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 *
 * @param {Object} a - sRGB color
 * @param {Object} b - sRGB color
 * @returns {Number} color ratio
 */
const getContrastRatio = (a, b) => {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [l1, l2] = la > lb ? [la, lb] : [lb, la]

  return (l1 + 0.05) / (l2 + 0.05)
}

/**
 * This generates what "worst case" color would look like for transparent
 * segments. I.e. black with .2 alpha and pure-white background image
 * could make white text unreadable
 *
 * @param {Object} srgb - transparent color
 * @param {Number} alpha - color's opacity/alpha channel
 * @param {Boolean} white - use white "background" if true, black otherwise
 * @returns {Object} sRGB of resulting color
 */
const transparentWorstCase = (srgb, alpha, white = false) => {
  const bg = 'rgb'.split('').reduce((acc, c) => { acc[c] = Number(white) * 255; return acc }, {})
  return 'rgb'.split('').reduce((acc, c) => {
    // Simplified https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
    // for opaque bg and transparent fg
    acc[c] = (srgb[c] * alpha + bg[c] * (1 - alpha))
    return acc
  }, {})
}

const worstCase = (bg, bga, text) => {
  if (bga === 1 || typeof bga === 'undefined') return bg
  // taken from https://github.com/toish/chromatism/blob/master/src/operations/contrastRatio.js
  const blackWorse = ((text.r * 299) + (text.g * 587) + (text.b * 114)) / 1000 <= 128
  return transparentWorstCase(bg, bga, !blackWorse)
}

const hex2rgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbstr2hex = (rgb) => {
  if (rgb[0] === '#') {
    return rgb
  }
  rgb = rgb.match(/\d+/g)
  return `#${((Number(rgb[0]) << 16) + (Number(rgb[1]) << 8) + Number(rgb[2])).toString(16)}`
}

const mixrgb = (a, b) => {
  return Object.keys(a).reduce((acc, k) => {
    acc[k] = (a[k] + b[k]) / 2
    return acc
  }, {})
}

export {
  rgb2hex,
  hex2rgb,
  mixrgb,
  rgbstr2hex,
  getContrastRatio,
  worstCase
}

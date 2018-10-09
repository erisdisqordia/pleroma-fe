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

// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
// https://www.w3.org/TR/2008/REC-WCAG20-20081211/relative-luminance.xml
// https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
const c2linear = (b) => {
  // W3C gives 0.03928 while wikipedia states 0.04045
  // what those magical numbers mean - I don't know.
  // something about gamma-correction, i suppose.
  // Sticking with W3C example.
  const c = b / 255
  if (c < 0.03928) {
    return c / 12.92
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4)
  }
}

const srgbToLinear = (srgb) => {
  return 'rgb'.split('').reduce((acc, c) => { acc[c] = c2linear(srgb[c]); return acc }, {})
}

// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
// https://www.w3.org/TR/2008/REC-WCAG20-20081211/relative-luminance.xml
const relativeLuminance = (srgb) => {
  const {r, g, b} = srgbToLinear(srgb)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
const getContrastRatio = (a, b) => {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [l1, l2] = la > lb ? [la, lb] : [lb, la]

  return (l1 + 0.05) / (l2 + 0.05)
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
  getContrastRatio
}

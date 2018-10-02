import { map } from 'lodash'

const rgb2hex = (r, g, b) => {
  console.log(r)
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
  rgbstr2hex
}

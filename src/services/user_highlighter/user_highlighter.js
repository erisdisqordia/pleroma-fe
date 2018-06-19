import { hex2rgb } from '../color_convert/color_convert.js'
const highlightStyle = (color) => {
  if (typeof color !== 'string') return
  const rgb = hex2rgb(color)
  const tintColor = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .1)`
  const tintColor2 = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .2)`
  return {
    backgroundImage: [
      'repeating-linear-gradient(-45deg,',
      `${tintColor} ,`,
      `${tintColor} 20px,`,
      `${tintColor2} 20px,`,
      `${tintColor2} 40px`
    ].join(' '),
    backgroundPosition: '0 0'
  }
}

const highlightClass = (user) => {
  return 'USER____' + user.screen_name
    .replace(/\./g, '_')
    .replace(/@/g, '_AT_')
}

export {
  highlightClass,
  highlightStyle
}

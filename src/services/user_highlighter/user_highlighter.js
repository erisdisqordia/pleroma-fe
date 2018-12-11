import { hex2rgb } from '../color_convert/color_convert.js'
const highlightStyle = (prefs) => {
  if (prefs === undefined) return
  const {color, type} = prefs
  if (typeof color !== 'string') return
  const rgb = hex2rgb(color)
  if (rgb == null) return
  const solidColor = `rgb(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)})`
  const tintColor = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .1)`
  const tintColor2 = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .2)`
  if (type === 'striped') {
    return {
      backgroundImage: [
        'repeating-linear-gradient(135deg,',
        `${tintColor} ,`,
        `${tintColor} 20px,`,
        `${tintColor2} 20px,`,
        `${tintColor2} 40px`
      ].join(' '),
      backgroundPosition: '0 0'
    }
  } else if (type === 'solid') {
    return {
      backgroundColor: tintColor2
    }
  } else if (type === 'side') {
    return {
      backgroundImage: [
        'linear-gradient(to right,',
        `${solidColor} ,`,
        `${solidColor} 2px,`,
        `transparent 6px`
      ].join(' '),
      backgroundPosition: '0 0'
    }
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

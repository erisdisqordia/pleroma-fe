import { times, map } from 'lodash'

const setStyle = (href, col, commit) => {
  /***
      What's going on here?
      I want to make it easy for admins to style this application. To have
      a good set of default themes, I chose the system from base16
      (https://chriskempson.github.io/base16/) to style all elements. They
      all have the base00..0F classes. So the only thing an admin needs to
      do to style Pleroma is to change these colors in that one css file.
      Some default things (body text color, link color) need to be set dy-
      namically, so this is done here by waiting for the stylesheet to be
      loaded and then creating an element with the respective classes.

      It is a bit weird, but should make life for admins somewhat easier.
  ***/
  const head = document.head
  const body = document.body
  body.style.display = 'none'
  const cssEl = document.createElement('link')
  cssEl.setAttribute('rel', 'stylesheet')
  cssEl.setAttribute('href', href)
  head.appendChild(cssEl)

  const setDynamic = () => {
    const baseEl = document.createElement('div')
    body.appendChild(baseEl)

    let colors = {}
    times(16, (n) => {
      const name = `base0${n.toString(16).toUpperCase()}`
      baseEl.setAttribute('class', name)
      const color = window.getComputedStyle(baseEl).getPropertyValue('color')
      colors[name] = color
    })

    commit('setOption', { name: 'colors', value: colors })

    body.removeChild(baseEl)

    const styleEl = document.createElement('style')
    head.appendChild(styleEl)
    const styleSheet = styleEl.sheet

    styleSheet.insertRule(`a { color: ${colors['base08']}`, 'index-max')
    styleSheet.insertRule(`body { color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base05-border { border-color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base03-border { border-color: ${colors['base03']}`, 'index-max')
    body.style.display = 'initial'
  }

  const rgb2hex = (r, g, b) => {
    [r, g, b] = map([r, g, b], (val) => {
      val = val < 0 ? 0 : val
      val = val > 255 ? 255 : val
      return val
    })
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  const setColors = () => {
    const styleEl = document.createElement('style')
    head.appendChild(styleEl)
    const styleSheet = styleEl.sheet

    const isDark = (col.text.r + col.text.g + col.text.b) > (col.bg.r + col.bg.g + col.bg.b)
    let colors = {}

    let mod = 10
    if (isDark) {
      mod = mod * -1
    }
    colors['base00'] = rgb2hex(col.bg.r, col.bg.g, col.bg.b)                         // background
    colors['base01'] = rgb2hex(col.bg.r - mod, col.bg.g - mod, col.bg.b - mod)       // hilighted bg
    colors['base02'] = rgb2hex(col.fg.r, col.fg.g, col.fg.b)                         // panels & buttons
    colors['base03'] = rgb2hex(col.fg.r - mod, col.fg.g - mod, col.fg.b - mod)       // borders
    colors['base04'] = rgb2hex(col.text.r + mod, col.text.g + mod, col.text.b + mod) // faint text
    colors['base05'] = rgb2hex(col.text.r, col.text.g, col.text.b)                   // text
    colors['base06'] = rgb2hex(col.text.r - mod, col.text.g - mod, col.text.b - mod) // strong text
    colors['base07'] = rgb2hex(col.text.r - mod * 2, col.text.g - mod * 2, col.text.b - mod * 2)
    colors['base08'] = rgb2hex(col.link.r, col.link.g, col.link.b)                   // links

    times(9, (n) => {
      const color = colors[`base0${n}`]
      styleSheet.insertRule(`.base0${n} { color: ${color}`, 'index-max')
      styleSheet.insertRule(`.base0${n}-background { background-color: ${color}`, 'index-max')
    })

    commit('setOption', { name: 'colors', value: colors })

    styleSheet.insertRule(`a { color: ${colors['base08']}`, 'index-max')
    styleSheet.insertRule(`body { color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base05-border { border-color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base03-border { border-color: ${colors['base03']}`, 'index-max')
    console.log(styleSheet)
    body.style.display = 'initial'
  }
  if (col) {
    setColors()
  } else {
    cssEl.addEventListener('load', setDynamic)
  }
}

const StyleSetter = {
  setStyle
}

export default StyleSetter

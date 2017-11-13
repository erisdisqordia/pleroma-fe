import { times } from 'lodash'

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
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  const setColors = () => {
    const styleEl = document.createElement('style')
    head.appendChild(styleEl)
    const styleSheet = styleEl.sheet

    const isDark = (col.fg.r + col.fg.g + col.fg.b) > (col.bg.r + col.bg.g + col.bg.b)
    let colors = {}

    times(4, (n) => {
      const nameLow = `base0${n.toString(16).toUpperCase()}`
      const nameHigh = `base0${(n + 4).toString(16).toUpperCase()}`
      if (isDark) {
        colors[nameLow] = rgb2hex(col.bg.r + 10 * n, col.bg.g + 10 * n, col.bg.b + 10 * n)
        colors[nameHigh] = rgb2hex(col.fg.r - 10 * n, col.fg.g - 10 * n, col.fg.b - 10 * n)
      } else {
        colors[nameLow] = rgb2hex(col.bg.r - 10 * n, col.bg.g - 10 * n, col.bg.b - 10 * n)
        colors[nameHigh] = rgb2hex(col.fg.r + 10 * n, col.fg.g + 10 * n, col.fg.b + 10 * n)
      }
      styleSheet.insertRule(`.${nameLow} { color: ${colors[nameLow]}`, 'index-max')
      styleSheet.insertRule(`.${nameHigh} { color: ${colors[nameHigh]}`, 'index-max')
      styleSheet.insertRule(`.${nameLow}-background { background-color: ${colors[nameLow]}`, 'index-max')
      styleSheet.insertRule(`.${nameHigh}-background { background-color: ${colors[nameHigh]}`, 'index-max')
    })
    colors['base08'] = rgb2hex(col.link.r, col.link.g, col.link.b)
    commit('setOption', { name: 'colors', value: colors })
    console.log(colors)

    styleSheet.insertRule(`a { color: ${colors['base08']}`, 'index-max')
    styleSheet.insertRule(`body { color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base05-border { border-color: ${colors['base05']}`, 'index-max')
    styleSheet.insertRule(`.base03-border { border-color: ${colors['base03']}`, 'index-max')
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

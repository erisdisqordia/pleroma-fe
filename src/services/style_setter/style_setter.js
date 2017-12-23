import { times } from 'lodash'
import { rgb2hex, hex2rgb } from '../color_convert/color_convert.js'

// While this is not used anymore right now, I left it in if we want to do custom
// styles that aren't just colors, so user can pick from a few different distinct
// styles as well as set their own colors in the future.

const setStyle = (href, commit) => {
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

  cssEl.addEventListener('load', setDynamic)
}

const setColors = (col, commit) => {
  const head = document.head
  const body = document.body
  body.style.display = 'none'

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
  colors['base01'] = rgb2hex((col.bg.r + col.fg.r) / 2, (col.bg.g + col.fg.g) / 2, (col.bg.b + col.fg.b) / 2) // hilighted bg
  colors['base02'] = rgb2hex(col.fg.r, col.fg.g, col.fg.b)                         // panels & buttons
  colors['base03'] = rgb2hex(col.fg.r - mod, col.fg.g - mod, col.fg.b - mod)       // borders
  colors['base04'] = rgb2hex(col.text.r + mod * 2, col.text.g + mod * 2, col.text.b + mod * 2) // faint text
  colors['base05'] = rgb2hex(col.text.r, col.text.g, col.text.b)                   // text
  colors['base06'] = rgb2hex(col.text.r - mod, col.text.g - mod, col.text.b - mod) // strong text
  colors['base07'] = rgb2hex(col.text.r - mod * 2, col.text.g - mod * 2, col.text.b - mod * 2)
  colors['base08'] = rgb2hex(col.link.r, col.link.g, col.link.b)                   // links
  colors['base09'] = rgb2hex((col.bg.r + col.text.r) / 2, (col.bg.g + col.text.g) / 2, (col.bg.b + col.text.b) / 2) // icons

  const num = 10
  times(num, (n) => {
    const color = colors[`base0${num - 1 - n}`]
    styleSheet.insertRule(`.base0${num - 1 - n} { color: ${color}`, 'index-max')
    styleSheet.insertRule(`.base0${num - 1 - n}-background { background-color: ${color}`, 'index-max')
  })

  styleSheet.insertRule(`a { color: ${colors['base08']}`, 'index-max')
  styleSheet.insertRule(`body { color: ${colors['base05']}`, 'index-max')
  styleSheet.insertRule(`.base05-border { border-color: ${colors['base05']}`, 'index-max')
  styleSheet.insertRule(`.base03-border { border-color: ${colors['base03']}`, 'index-max')
  body.style.display = 'initial'

  commit('setOption', { name: 'colors', value: colors })
  commit('setOption', { name: 'customTheme', value: col })
}

const setPreset = (val, commit) => {
  window.fetch('/static/styles.json')
    .then((data) => data.json())
    .then((themes) => {
      const theme = themes[val] ? themes[val] : themes['pleroma-dark']
      const bgRgb = hex2rgb(theme[1])
      const fgRgb = hex2rgb(theme[2])
      const textRgb = hex2rgb(theme[3])
      const linkRgb = hex2rgb(theme[4])
      const col = {
        bg: bgRgb,
        fg: fgRgb,
        text: textRgb,
        link: linkRgb
      }
      // This is a hack, this function is only called during initial load.
      // We want to cancel loading the theme from config.json if we're already
      // loading a theme from the persisted state.
      // Needed some way of dealing with the async way of things.
      // load config -> set preset -> wait for styles.json to load ->
      // load persisted state -> set colors -> styles.json loaded -> set colors
      if (!window.themeLoaded) {
        setColors(col, commit)
      }
    })
}

const StyleSetter = {
  setStyle,
  setPreset,
  setColors
}

export default StyleSetter

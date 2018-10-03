import { times } from 'lodash'
import { brightness, invertLightness, convert } from 'chromatism'
import { rgb2hex, hex2rgb, mixrgb } from '../color_convert/color_convert.js'

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
    // const styleSheet = styleEl.sheet

    body.style.display = 'initial'
  }

  cssEl.addEventListener('load', setDynamic)
}

const rgb2rgba = function (rgba) {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}

const getTextColor = function (bg, text) {
  const bgIsLight = convert(bg).hsl.l > 50
  const textIsLight = convert(text).hsl.l > 50

  if ((bgIsLight && textIsLight) || (!bgIsLight && !textIsLight)) {
    const base = typeof text.a !== 'undefined' ? { a: text.a } : {}
    return Object.assign(base, invertLightness(text).rgb)
  }
  return text
}

const setColors = (input, commit) => {
  const { colorRules, radiiRules } = generatePreset(input)
  const head = document.head
  const body = document.body
  body.style.display = 'none'

  const styleEl = document.createElement('style')
  head.appendChild(styleEl)
  const styleSheet = styleEl.sheet

  styleSheet.toString()
  styleSheet.insertRule(`body { ${colorRules} }`, 'index-max')
  styleSheet.insertRule(`body { ${radiiRules} }`, 'index-max')
  body.style.display = 'initial'

  // commit('setOption', { name: 'colors', value: htmlColors })
  // commit('setOption', { name: 'radii', value: radii })
  commit('setOption', { name: 'customTheme', value: input })
}

const generatePreset = (input) => {
  console.log(input)
  const radii = input.radii || {
    btnRadius: input.btnRadius,
    inputRadius: input.inputRadius,
    panelRadius: input.panelRadius,
    avatarRadius: input.avatarRadius,
    avatarAltRadius: input.avatarAltRadius,
    tooltipRadius: input.tooltipRadius,
    attachmentRadius: input.attachmentRadius
  }
  const colors = {}

  const col = Object.entries(input.colors || input).reduce((acc, [k, v]) => {
    if (typeof v === 'object') {
      acc[k] = v
    } else {
      acc[k] = hex2rgb(v)
    }
    return acc
  }, {})

  colors.fg = col.fg || col.text                   // text
  colors.text = col.fg || col.text                   // text
  colors.lightFg = col.fg || col.text                   // text

  colors.bg = col.bg                         // background
  colors.lightBg = col.lightBg || brightness(5, colors.bg).rgb // hilighted bg

  colors.btn = col.btn || { r: 0, g: 0, b: 0 }
  colors.btnText = getTextColor(colors.btn, colors.text)

  colors.panel = col.panel || col.btn
  colors.panelText = getTextColor(colors.panel, colors.text)

  colors.topBar = col.topBar || col.btn
  colors.topBarText = getTextColor(colors.topBar, colors.text)

  colors.input = col.input || Object.assign({ a: 0.5 }, col.btn)
  colors.border = col.btn       // borders
  colors.faint = col.faint || Object.assign({ a: 0.5 }, col.text)

  colors.link = col.link                   // links
  colors.icon = mixrgb(colors.bg, colors.text) // icons

  colors.cBlue = col.cBlue
  colors.cRed = col.cRed
  colors.cGreen = col.cGreen
  colors.cOrange = col.cOrange

  colors.cAlertRed = col.cAlertRed || Object.assign({ a: 0.5 }, col.cRed)

  const htmlColors = Object.entries(colors)
        .reduce((acc, [k, v]) => {
          if (!v) return acc
          acc[k] = typeof v.a === 'undefined' ? rgb2hex(v) : rgb2rgba(v)
          return acc
        }, {})

  return {
    colorRules: Object.entries(htmlColors).filter(([k, v]) => v).map(([k, v]) => `--${k}: ${v}`).join(';'),
    radiiRules: Object.entries(radii).filter(([k, v]) => v).map(([k, v]) => `--${k}: ${v}px`).join(';')
  }
}

const setPreset = (val, commit) => {
  window.fetch('/static/styles.json')
    .then((data) => data.json())
    .then((themes) => {
      const theme = themes[val] ? themes[val] : themes['pleroma-dark']
      const bgRgb = hex2rgb(theme[1])
      const btnRgb = hex2rgb(theme[2])
      const textRgb = hex2rgb(theme[3])
      const linkRgb = hex2rgb(theme[4])

      const cRedRgb = hex2rgb(theme[5] || '#FF0000')
      const cGreenRgb = hex2rgb(theme[6] || '#00FF00')
      const cBlueRgb = hex2rgb(theme[7] || '#0000FF')
      const cOrangeRgb = hex2rgb(theme[8] || '#E3FF00')

      const colors = {
        bg: bgRgb,
        btn: btnRgb,
        text: textRgb,
        link: linkRgb,
        cRed: cRedRgb,
        cBlue: cBlueRgb,
        cGreen: cGreenRgb,
        cOrange: cOrangeRgb
      }

      // This is a hack, this function is only called during initial load.
      // We want to cancel loading the theme from config.json if we're already
      // loading a theme from the persisted state.
      // Needed some way of dealing with the async way of things.
      // load config -> set preset -> wait for styles.json to load ->
      // load persisted state -> set colors -> styles.json loaded -> set colors
      if (!window.themeLoaded) {
        setColors({ colors }, commit)
      }
    })
}

const StyleSetter = {
  setStyle,
  setPreset,
  setColors,
  generatePreset
}

export default StyleSetter

import { times } from 'lodash'
import { brightness, invertLightness, convert, contrastRatio } from 'chromatism'
import { rgb2hex, hex2rgb, mixrgb, getContrastRatio, alphaBlend } from '../color_convert/color_convert.js'

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

const getTextColor = function (bg, text, preserve) {
  const bgIsLight = convert(bg).hsl.l > 50
  const textIsLight = convert(text).hsl.l > 50

  if ((bgIsLight && textIsLight) || (!bgIsLight && !textIsLight)) {
    const base = typeof text.a !== 'undefined' ? { a: text.a } : {}
    const result = Object.assign(base, invertLightness(text).rgb)
    if (!preserve && getContrastRatio(bg, result) < 4.5) {
      return contrastRatio(bg, text).rgb
    }
    return result
  }
  return text
}

const setColors = (input, commit) => {
  const { rules, theme } = generatePreset(input)
  const head = document.head
  const body = document.body
  body.style.display = 'none'

  const styleEl = document.createElement('style')
  head.appendChild(styleEl)
  const styleSheet = styleEl.sheet

  console.log(rules)
  styleSheet.toString()
  styleSheet.insertRule(`body { ${rules.radii} }`, 'index-max')
  styleSheet.insertRule(`body { ${rules.colors} }`, 'index-max')
  styleSheet.insertRule(`body { ${rules.shadows} }`, 'index-max')
  body.style.display = 'initial'

  // commit('setOption', { name: 'colors', value: htmlColors })
  // commit('setOption', { name: 'radii', value: radii })
  commit('setOption', { name: 'customTheme', value: input })
  commit('setOption', { name: 'colors', value: theme.colors })
}

const getCssShadow = (input) => {
  console.log(input)
  // >shad
  return input.map((shad) => [
    shad.x,
    shad.y,
    shad.blur,
    shad.spread
  ].map(_ => _ + 'px').concat([
    rgb2rgba({...(hex2rgb(shad.color)), a: shad.alpha}),
    shad.inset ? 'inset' : ''
  ]).join(' ')).join(', ')
}

const generateColors = (input) => {
  console.log(input.opacity)
  const colors = {}
  const opacity = Object.assign({
    alert: 0.5,
    input: 0.5,
    faint: 0.5
  }, Object.entries(input.opacity || {}).reduce((acc, [k, v]) => {
    if (typeof v !== 'undefined') {
      acc[k] = v
    }
    return acc
  }, {}))
  console.log(colors, opacity)
  const col = Object.entries(input.colors || input).reduce((acc, [k, v]) => {
    if (typeof v === 'object') {
      acc[k] = v
    } else {
      acc[k] = hex2rgb(v)
    }
    return acc
  }, {})

  const isLightOnDark = convert(col.bg).hsl.l < convert(col.text).hsl.l
  const mod = isLightOnDark ? 1 : -1

  colors.text = col.text
  colors.lightText = brightness(20 * mod, colors.text).rgb
  colors.link = col.link
  colors.faint = col.faint || Object.assign({}, col.text)

  colors.bg = col.bg
  colors.lightBg = col.lightBg || brightness(5, colors.bg).rgb

  colors.fg = col.fg
  colors.fgText = col.fgText || getTextColor(colors.fg, colors.text)
  colors.fgLink = col.fgLink || getTextColor(colors.fg, colors.link, true)

  colors.border = col.border || brightness(2 * mod, colors.fg).rgb

  colors.btn = col.btn || Object.assign({}, col.fg)
  colors.btnText = col.btnText || getTextColor(colors.btn, colors.fgText)

  colors.input = col.input || Object.assign({}, col.fg)
  colors.inputText = col.inputText || getTextColor(colors.input, colors.lightText)

  colors.panel = col.panel || Object.assign({}, col.fg)
  colors.panelText = col.panelText || getTextColor(colors.panel, colors.fgText)
  colors.panelFaint = col.panelFaint || getTextColor(colors.panel, colors.faint)

  colors.topBar = col.topBar || Object.assign({}, col.fg)
  colors.topBarText = col.topBarText || getTextColor(colors.topBar, colors.fgText)
  colors.topBarLink = col.topBarLink || getTextColor(colors.topBar, colors.fgLink)

  colors.faintLink = col.faintLink || Object.assign({}, col.link)

  colors.icon = mixrgb(colors.bg, colors.text)

  colors.cBlue = col.cBlue
  colors.cRed = col.cRed
  colors.cGreen = col.cGreen
  colors.cOrange = col.cOrange

  colors.alertError = col.alertError || Object.assign({}, col.cRed)
  colors.alertErrorText = getTextColor(alphaBlend(colors.alertError, opacity.alert, colors.bg), colors.text)
  colors.alertErrorPanelText = getTextColor(alphaBlend(colors.alertError, opacity.alert, colors.panel), colors.panelText)

  colors.badgeNotification = col.badgeNotification || Object.assign({}, col.cRed)
  colors.badgeNotificationText = contrastRatio(colors.badgeNotification).rgb

  Object.entries(opacity).forEach(([ k, v ]) => {
    if (typeof v === 'undefined') return
    if (k === 'alert') {
      colors.alertError.a = v
      return
    }
    if (k === 'faint') {
      colors[k + 'Link'].a = v
      colors['panelFaint'].a = v
    }
    if (colors[k]) {
      colors[k].a = v
    } else {
      console.error('Wrong key ' + k)
    }
  })

  const htmlColors = Object.entries(colors)
        .reduce((acc, [k, v]) => {
          if (!v) return acc
          acc.solid[k] = rgb2hex(v)
          acc.complete[k] = typeof v.a === 'undefined' ? rgb2hex(v) : rgb2rgba(v)
          return acc
        }, { complete: {}, solid: {} })
  return {
    rules: {
      colors: Object.entries(htmlColors.complete)
        .filter(([k, v]) => v)
        .map(([k, v]) => `--${k}: ${v}`)
        .join(';')
    },
    theme: {
      colors: htmlColors.solid,
      opacity
    }
  }
}

const generateRadii = (input) => {
  const inputRadii = input.radii || {
    btn: input.btnRadius,
    input: input.inputRadius,
    panel: input.panelRadius,
    avatar: input.avatarRadius,
    avatarAlt: input.avatarAltRadius,
    tooltip: input.tooltipRadius,
    attachment: input.attachmentRadius
  }

  const radii = {
    btn: 4,
    input: 4,
    panel: 10,
    avatar: 5,
    avatarAlt: 50,
    tooltip: 2,
    attachment: 5,
    ...inputRadii
  }

  return {
    rules: {
      radii: Object.entries(radii).filter(([k, v]) => v).map(([k, v]) => `--${k}Radius: ${v}px`).join(';')
    },
    theme: {
      radii
    }
  }
}

const generateShadows = (input) => {
  const shadows = {
    panel: [{
      x: 1,
      y: 1,
      blur: 4,
      spread: 0,
      color: '#000000',
      alpha: 0.6
    }],
    ...(input.shadows || {})
  }
  console.log('benis')

  return {
    rules: {
      shadows: Object.entries(shadows).filter(([k, v]) => v).map(([k, v]) => `--${k}Shadow: ${getCssShadow(v)}`).join(';')
    },
    theme: {
      shadows
    }
  }
}

const composePreset = (colors, radii, shadows) => {
  return {
    rules: {
      ...shadows.rules,
      ...colors.rules,
      ...radii.rules
    },
    theme: {
      ...shadows.theme,
      ...colors.theme,
      ...radii.theme
    }
  }
}

const generatePreset = (input) => {
  const shadows = generateShadows(input)
  const colors = generateColors(input)
  const radii = generateRadii(input)

  return composePreset(colors, radii, shadows)
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

      const cRedRgb = hex2rgb(theme[5] || '#FF0000')
      const cGreenRgb = hex2rgb(theme[6] || '#00FF00')
      const cBlueRgb = hex2rgb(theme[7] || '#0000FF')
      const cOrangeRgb = hex2rgb(theme[8] || '#E3FF00')

      const colors = {
        bg: bgRgb,
        fg: fgRgb,
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

export {
  setStyle,
  setPreset,
  setColors,
  getTextColor,
  generateColors,
  generateRadii,
  generateShadows,
  generatePreset,
  composePreset,
  getCssShadow
}

import { times } from 'lodash'
import { brightness, invertLightness, convert, contrastRatio } from 'chromatism'
import { rgb2hex, hex2rgb, mixrgb, getContrastRatio, alphaBlend, alphaBlendLayers } from '../color_convert/color_convert.js'

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
  body.classList.add('hidden')
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

    body.classList.remove('hidden')
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
      // B&W
      return contrastRatio(bg, text).rgb
    }
    // Inverted color
    return result
  }
  return text
}

const applyTheme = (input, commit) => {
  const { rules, theme } = generatePreset(input)
  const head = document.head
  const body = document.body
  body.classList.add('hidden')

  const styleEl = document.createElement('style')
  head.appendChild(styleEl)
  const styleSheet = styleEl.sheet

  styleSheet.toString()
  styleSheet.insertRule(`body { ${rules.radii} }`, 'index-max')
  styleSheet.insertRule(`body { ${rules.colors} }`, 'index-max')
  styleSheet.insertRule(`body { ${rules.shadows} }`, 'index-max')
  styleSheet.insertRule(`body { ${rules.fonts} }`, 'index-max')
  body.classList.remove('hidden')

  // commit('setOption', { name: 'colors', value: htmlColors })
  // commit('setOption', { name: 'radii', value: radii })
  commit('setOption', { name: 'customTheme', value: input })
  commit('setOption', { name: 'colors', value: theme.colors })
}

const getCssShadow = (input, usesDropShadow) => {
  if (input.length === 0) {
    return 'none'
  }

  return input
    .filter(_ => usesDropShadow ? _.inset : _)
    .map((shad) => [
      shad.x,
      shad.y,
      shad.blur,
      shad.spread
    ].map(_ => _ + 'px').concat([
      getCssColor(shad.color, shad.alpha),
      shad.inset ? 'inset' : ''
    ]).join(' ')).join(', ')
}

const getCssShadowFilter = (input) => {
  if (input.length === 0) {
    return 'none'
  }

  return input
  // drop-shadow doesn't support inset or spread
    .filter((shad) => !shad.inset && Number(shad.spread) === 0)
    .map((shad) => [
      shad.x,
      shad.y,
      // drop-shadow's blur is twice as strong compared to box-shadow
      shad.blur / 2
    ].map(_ => _ + 'px').concat([
      getCssColor(shad.color, shad.alpha)
    ]).join(' '))
    .map(_ => `drop-shadow(${_})`)
    .join(' ')
}

const getCssColor = (input, a) => {
  let rgb = {}
  if (typeof input === 'object') {
    rgb = input
  } else if (typeof input === 'string') {
    if (input.startsWith('#')) {
      rgb = hex2rgb(input)
    } else if (input.startsWith('--')) {
      return `var(${input})`
    } else {
      return input
    }
  }
  return rgb2rgba({ ...rgb, a })
}

// Generates a "patch" for theme to make it compatible with v2
export const generateCompat = (input) => {
  const { colors } = input
  const v3compat = {
    colors: {}
  }
  const v2colorsPatch = {}

  // # Link became optional in v3
  if (typeof colors.link === 'undefined') {
    v2colorsPatch.link = colors.accent
    v3compat.colors.link = null
  }

  return {
    v3compat,
    colors: v2colorsPatch
  }
}

const generateColors = (themeData) => {
  const colors = {}
  const rawOpacity = Object.assign({
    alert: 0.5,
    input: 0.5,
    faint: 0.5,
    underlay: 0.15
  }, Object.entries(themeData.opacity || {}).reduce((acc, [k, v]) => {
    if (typeof v !== 'undefined') {
      acc[k] = v
    }
    return acc
  }, {}))

  const inputColors = themeData.colors || themeData

  const transparentsOpacity = Object.entries(inputColors).reduce((acc, [k, v]) => {
    if (v === 'transparent') {
      acc[k] = 0
    }
    return acc
  }, {})

  const opacity = { ...rawOpacity, ...transparentsOpacity }

  const compat = themeData.v3compat || {}
  const compatColors = Object.entries(compat.colors || {}).reduce((acc, [key, value]) => {
    const newVal = value === null ? undefined : value
    return { ...acc, [key]: newVal }
  }, {})

  const col = Object.entries({ ...inputColors, ...compatColors }).reduce((acc, [k, v]) => {
    if (typeof v === 'object') {
      acc[k] = v
    } else {
      let value = v
      if (v === 'transparent') {
        value = '#FF00FF'
      }
      acc[k] = hex2rgb(value)
    }
    return acc
  }, {})

  colors.bg = col.bg
  colors.underlay = col.underlay || hex2rgb('#000000')
  colors.text = col.text

  const isLightOnDark = convert(colors.bg).hsl.l < convert(colors.text).hsl.l
  const mod = isLightOnDark ? 1 : -1

  colors.lightText = brightness(20 * mod, colors.text).rgb

  colors.accent = col.accent || col.link
  colors.link = col.link || col.accent

  colors.faint = col.faint || Object.assign({}, col.text)

  colors.lightBg = col.lightBg || brightness(5 * mod, colors.bg).rgb

  const underlay = [colors.underlay, opacity.underlay]
  const fg = [col.fg, opacity.fg]
  const bg = [col.bg, opacity.bg]

  colors.fg = col.fg
  colors.fgText = col.fgText || getTextColor(alphaBlendLayers(colors.text, [underlay, bg, fg]), colors.text)
  colors.fgLink = col.fgLink || getTextColor(alphaBlendLayers(colors.link, [underlay, bg, fg]), colors.link, true)

  colors.border = col.border || brightness(2 * mod, colors.fg).rgb

  colors.btn = col.btn || Object.assign({}, col.fg)
  const btn = [colors.btn, opacity.btn || 1]
  colors.btnText = col.btnText || getTextColor(alphaBlendLayers(colors.fgText, [underlay, bg, fg, btn]), colors.fgText)

  colors.input = col.input || Object.assign({}, col.fg)
  const input = [colors.input, opacity.input]
  colors.inputText = col.inputText || getTextColor(alphaBlendLayers(colors.lightText, [underlay, bg, fg, input]), colors.lightText)

  colors.panel = col.panel || Object.assign({}, col.fg)
  const panel = [colors.panel, opacity.panel]
  colors.panelText = col.panelText || getTextColor(alphaBlendLayers(colors.fgText, [underlay, bg, panel]), colors.fgText)
  colors.panelLink = col.panelLink || getTextColor(alphaBlendLayers(colors.fgLink, [underlay, bg, panel]), colors.fgLink)
  colors.panelFaint = col.panelFaint || getTextColor(alphaBlendLayers(colors.faint, [underlay, bg, panel]), colors.faint)

  colors.topBar = col.topBar || Object.assign({}, col.fg)
  const topBar = [colors.topBar, opacity.topBar]
  colors.topBarText = col.topBarText || getTextColor(alphaBlendLayers(colors.fgText, [topBar]), colors.fgText)
  colors.topBarLink = col.topBarLink || getTextColor(alphaBlendLayers(colors.fgLink, [topBar]), colors.fgLink)

  colors.faintLink = col.faintLink || Object.assign({}, col.link || col.accent)
  colors.linkBg = alphaBlend(colors.link, 0.4, colors.bg)

  colors.icon = mixrgb(colors.bg, colors.text)

  colors.cBlue = col.cBlue || hex2rgb('#0000FF')
  colors.cRed = col.cRed || hex2rgb('#FF0000')
  colors.cGreen = col.cGreen || hex2rgb('#00FF00')
  colors.cOrange = col.cOrange || hex2rgb('#E3FF00')

  colors.alertError = col.alertError || Object.assign({}, colors.cRed)
  const alertError = [colors.alertError, opacity.alert]
  colors.alertErrorText = getTextColor(alphaBlendLayers(colors.text, [underlay, bg, alertError]), colors.text)
  colors.alertErrorPanelText = getTextColor(alphaBlendLayers(colors.panelText, [underlay, bg, panel, panel, alertError]), colors.panelText)

  colors.alertWarning = col.alertWarning || Object.assign({}, colors.cOrange)
  const alertWarning = [colors.alertWarning, opacity.alert]
  colors.alertWarningText = getTextColor(alphaBlendLayers(colors.text, [underlay, bg, alertWarning]), colors.text)
  colors.alertWarningPanelText = getTextColor(alphaBlendLayers(colors.panelText, [underlay, bg, panel, panel, alertWarning]), colors.panelText)

  colors.badgeNotification = col.badgeNotification || Object.assign({}, colors.cRed)
  colors.badgeNotificationText = contrastRatio(colors.badgeNotification).rgb

  Object.entries(opacity).forEach(([ k, v ]) => {
    console.log(k)
    if (typeof v === 'undefined') return
    if (k === 'alert') {
      colors.alertError.a = v
      colors.alertWarning.a = v
      return
    }
    if (k === 'faint') {
      colors[k + 'Link'].a = v
      colors['panelFaint'].a = v
    }
    if (k === 'bg') {
      colors['lightBg'].a = v
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
  let inputRadii = input.radii || {}
  // v1 -> v2
  if (typeof input.btnRadius !== 'undefined') {
    inputRadii = Object
      .entries(input)
      .filter(([k, v]) => k.endsWith('Radius'))
      .reduce((acc, e) => { acc[e[0].split('Radius')[0]] = e[1]; return acc }, {})
  }
  const radii = Object.entries(inputRadii).filter(([k, v]) => v).reduce((acc, [k, v]) => {
    acc[k] = v
    return acc
  }, {
    btn: 4,
    input: 4,
    checkbox: 2,
    panel: 10,
    avatar: 5,
    avatarAlt: 50,
    tooltip: 2,
    attachment: 5
  })

  return {
    rules: {
      radii: Object.entries(radii).filter(([k, v]) => v).map(([k, v]) => `--${k}Radius: ${v}px`).join(';')
    },
    theme: {
      radii
    }
  }
}

const generateFonts = (input) => {
  const fonts = Object.entries(input.fonts || {}).filter(([k, v]) => v).reduce((acc, [k, v]) => {
    acc[k] = Object.entries(v).filter(([k, v]) => v).reduce((acc, [k, v]) => {
      acc[k] = v
      return acc
    }, acc[k])
    return acc
  }, {
    interface: {
      family: 'sans-serif'
    },
    input: {
      family: 'inherit'
    },
    post: {
      family: 'inherit'
    },
    postCode: {
      family: 'monospace'
    }
  })

  return {
    rules: {
      fonts: Object
        .entries(fonts)
        .filter(([k, v]) => v)
        .map(([k, v]) => `--${k}Font: ${v.family}`).join(';')
    },
    theme: {
      fonts
    }
  }
}

const generateShadows = (input) => {
  const border = (top, shadow) => ({
    x: 0,
    y: top ? 1 : -1,
    blur: 0,
    spread: 0,
    color: shadow ? '#000000' : '#FFFFFF',
    alpha: 0.2,
    inset: true
  })
  const buttonInsetFakeBorders = [border(true, false), border(false, true)]
  const inputInsetFakeBorders = [border(true, true), border(false, false)]
  const hoverGlow = {
    x: 0,
    y: 0,
    blur: 4,
    spread: 0,
    color: '--faint',
    alpha: 1
  }

  const shadows = {
    panel: [{
      x: 1,
      y: 1,
      blur: 4,
      spread: 0,
      color: '#000000',
      alpha: 0.6
    }],
    topBar: [{
      x: 0,
      y: 0,
      blur: 4,
      spread: 0,
      color: '#000000',
      alpha: 0.6
    }],
    popup: [{
      x: 2,
      y: 2,
      blur: 3,
      spread: 0,
      color: '#000000',
      alpha: 0.5
    }],
    avatar: [{
      x: 0,
      y: 1,
      blur: 8,
      spread: 0,
      color: '#000000',
      alpha: 0.7
    }],
    avatarStatus: [],
    panelHeader: [],
    button: [{
      x: 0,
      y: 0,
      blur: 2,
      spread: 0,
      color: '#000000',
      alpha: 1
    }, ...buttonInsetFakeBorders],
    buttonHover: [hoverGlow, ...buttonInsetFakeBorders],
    buttonPressed: [hoverGlow, ...inputInsetFakeBorders],
    input: [...inputInsetFakeBorders, {
      x: 0,
      y: 0,
      blur: 2,
      inset: true,
      spread: 0,
      color: '#000000',
      alpha: 1
    }],
    ...(input.shadows || {})
  }

  return {
    rules: {
      shadows: Object
        .entries(shadows)
      // TODO for v2.1: if shadow doesn't have non-inset shadows with spread > 0 - optionally
      // convert all non-inset shadows into filter: drop-shadow() to boost performance
        .map(([k, v]) => [
          `--${k}Shadow: ${getCssShadow(v)}`,
          `--${k}ShadowFilter: ${getCssShadowFilter(v)}`,
          `--${k}ShadowInset: ${getCssShadow(v, true)}`
        ].join(';'))
        .join(';')
    },
    theme: {
      shadows
    }
  }
}

const composePreset = (colors, radii, shadows, fonts) => {
  return {
    rules: {
      ...shadows.rules,
      ...colors.rules,
      ...radii.rules,
      ...fonts.rules
    },
    theme: {
      ...shadows.theme,
      ...colors.theme,
      ...radii.theme,
      ...fonts.theme
    }
  }
}

const generatePreset = (input) => {
  const shadows = generateShadows(input)
  const colors = generateColors(input)
  const radii = generateRadii(input)
  const fonts = generateFonts(input)

  return composePreset(colors, radii, shadows, fonts)
}

const getThemes = () => {
  return window.fetch('/static/styles.json')
    .then((data) => data.json())
    .then((themes) => {
      return Promise.all(Object.entries(themes).map(([k, v]) => {
        if (typeof v === 'object') {
          return Promise.resolve([k, v])
        } else if (typeof v === 'string') {
          return window.fetch(v)
            .then((data) => data.json())
            .then((theme) => {
              return [k, theme]
            })
            .catch((e) => {
              console.error(e)
              return []
            })
        }
      }))
    })
    .then((promises) => {
      return promises
        .filter(([k, v]) => v)
        .reduce((acc, [k, v]) => {
          acc[k] = v
          return acc
        }, {})
    })
}

const setPreset = (val, commit) => {
  return getThemes().then((themes) => {
    const theme = themes[val] ? themes[val] : themes['pleroma-dark']
    const isV1 = Array.isArray(theme)
    const data = isV1 ? {} : theme.theme

    if (isV1) {
      const bgRgb = hex2rgb(theme[1])
      const fgRgb = hex2rgb(theme[2])
      const textRgb = hex2rgb(theme[3])
      const linkRgb = hex2rgb(theme[4])

      const cRedRgb = hex2rgb(theme[5] || '#FF0000')
      const cGreenRgb = hex2rgb(theme[6] || '#00FF00')
      const cBlueRgb = hex2rgb(theme[7] || '#0000FF')
      const cOrangeRgb = hex2rgb(theme[8] || '#E3FF00')

      data.colors = {
        bg: bgRgb,
        fg: fgRgb,
        text: textRgb,
        link: linkRgb,
        cRed: cRedRgb,
        cBlue: cBlueRgb,
        cGreen: cGreenRgb,
        cOrange: cOrangeRgb
      }
    }

    // This is a hack, this function is only called during initial load.
    // We want to cancel loading the theme from config.json if we're already
    // loading a theme from the persisted state.
    // Needed some way of dealing with the async way of things.
    // load config -> set preset -> wait for styles.json to load ->
    // load persisted state -> set colors -> styles.json loaded -> set colors
    if (!window.themeLoaded) {
      applyTheme(data, commit)
    }
  })
}

export {
  setStyle,
  setPreset,
  applyTheme,
  getTextColor,
  generateColors,
  generateRadii,
  generateShadows,
  generateFonts,
  generatePreset,
  getThemes,
  composePreset,
  getCssShadow,
  getCssShadowFilter
}

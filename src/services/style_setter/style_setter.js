import { times } from 'lodash'
import { brightness, invertLightness, convert, contrastRatio } from 'chromatism'
import { rgb2hex, hex2rgb, mixrgb, getContrastRatio, alphaBlend, alphaBlendLayers } from '../color_convert/color_convert.js'

export const CURRENT_VERSION = 3
/* This is a definition of all layer combinations
 * each key is a topmost layer, each value represents layer underneath
 * this is essentially a simplified tree
 */
export const LAYERS = {
  undelay: null, // root
  topBar: null, // no transparency support
  badge: null, //  no transparency support
  fg: null,
  bg: 'underlay',
  panel: 'bg',
  btn: 'bg',
  btnPanel: 'panel',
  btnTopBar: 'topBar',
  input: 'bg',
  inputPanel: 'panel',
  inputTopBar: 'topBar',
  alert: 'bg',
  alertPanel: 'panel'
}

export const SLOT_INHERITANCE = {
  bg: null,
  fg: null,
  text: null,
  underlay: '#000000',
  link: '--accent',
  accent: '--link',
  faint: '--text',
  faintLink: '--link',

  cBlue: '#0000ff',
  cRed: '#FF0000',
  cGreen: '#00FF00',
  cOrange: '#E3FF00',

  lightBg: {
    depends: ['bg'],
    color: (mod, bg) => brightness(5 * mod, bg).rgb
  },
  lightText: {
    depends: ['text'],
    color: (mod, text) => brightness(20 * mod, text).rgb
  },

  border: {
    depends: 'fg',
    color: (mod, fg) => brightness(2 * mod, fg).rgb
  },

  linkBg: {
    depends: ['accent', 'bg'],
    color: (mod, accent, bg) => alphaBlend(accent, 0.4, bg).rgb
  },

  icon: {
    depends: ['bg', 'text'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  // Foreground
  fgText: {
    depends: ['text'],
    layer: 'fg',
    textColor: true
  },
  fgLink: {
    depends: ['link'],
    layer: 'fg',
    textColor: 'preserve'
  },

  // Panel header
  panel: '--fg',
  panelText: {
    depends: ['fgText'],
    layer: 'panel',
    textColor: true
  },
  panelFaint: {
    depends: ['fgText'],
    layer: 'panel',
    textColor: true
  },
  panelLink: {
    depends: ['fgLink'],
    layer: 'panel',
    textColor: 'preserve'
  },

  // Top bar
  topBar: '--fg',
  topBarText: {
    depends: ['fgText'],
    layer: 'topBar',
    textColor: true
  },
  topBarLink: {
    depends: ['fgLink'],
    layer: 'topBar',
    textColor: 'preserve'
  },

  // Buttons
  btn: '--fg',
  btnText: {
    depends: ['fgText'],
    layer: 'btn'
  },
  btnPanelText: {
    depends: ['panelText'],
    layer: 'btnPanel',
    variant: 'btn',
    textColor: true
  },
  btnTopBarText: {
    depends: ['topBarText'],
    layer: 'btnTopBar',
    variant: 'btn',
    textColor: true
  },

  // Input fields
  input: '--fg',
  inputText: {
    depends: ['text'],
    layer: 'input',
    textColor: true
  },
  inputPanelText: {
    depends: ['panelText'],
    layer: 'inputPanel',
    variant: 'input',
    textColor: true
  },
  inputTopbarText: {
    depends: ['topBarText'],
    layer: 'inputTopBar',
    variant: 'input',
    textColor: true
  },

  alertError: '--cRed',
  alertErrorText: {
    depends: ['text', 'alertError'],
    layer: 'alert',
    variant: 'alertError',
    textColor: true
  },
  alertErrorPanelText: {
    depends: ['panelText', 'alertError'],
    layer: 'alertPanel',
    variant: 'alertError',
    textColor: true
  },

  alertWarning: '--cOrange',
  alertWarningText: {
    depends: ['text', 'alertWarning'],
    layer: 'alert',
    variant: 'alertWarning',
    textColor: true
  },
  alertWarningPanelText: {
    depends: ['panelText', 'alertWarning'],
    layer: 'alertPanel',
    variant: 'alertWarning',
    textColor: true
  },

  badgeNotification: '--cRed',
  badgeNotificationText: {
    depends: ['text', 'badgeNotification'],
    layer: 'badge',
    variant: 'badgeNotification',
    textColor: 'bw'
  }
}

export const getLayersArray = (layer, data = LAYERS) => {
  let array = [layer]
  let parent = data[layer]
  while (parent) {
    array.unshift(parent)
    parent = data[parent]
  }
  return array
}

export const getLayers = (layer, variant = layer, colors, opacity) => {
  return getLayersArray(layer).map((currentLayer) => ([
    currentLayer === layer
      ? colors[variant]
      : colors[currentLayer],
    opacity[currentLayer]
  ]))
}

const getDependencies = (key, inheritance) => {
  const data = inheritance[key]
  if (typeof data === 'string' && data.startsWith('--')) {
    return [data.substring(2)]
  } else {
    if (data === null) return []
    const { depends, layer, variant } = data
    const layerDeps = layer
      ? getLayersArray(layer).map(currentLayer => {
        return currentLayer === layer
          ? variant || layer
          : currentLayer
      })
      : []
    if (Array.isArray(depends)) {
      return [...depends, ...layerDeps]
    } else {
      return [...layerDeps]
    }
  }
}

export const topoSort = (
  inheritance = SLOT_INHERITANCE,
  getDeps = getDependencies
) => {
  // This is an implementation of https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm

  const allKeys = Object.keys(inheritance)
  const whites = new Set(allKeys)
  const grays = new Set()
  const blacks = new Set()
  const unprocessed = [...allKeys]
  const output = []

  const step = (node) => {
    if (whites.has(node)) {
      // Make node "gray"
      whites.delete(node)
      grays.add(node)
      // Do step for each node connected to it (one way)
      getDeps(node, inheritance).forEach(step)
      // Make node "black"
      grays.delete(node)
      blacks.add(node)
      // Put it into the output list
      output.push(node)
    } else if (grays.has(node)) {
      console.debug('Cyclic depenency in topoSort, ignoring')
      output.push(node)
    } else if (blacks.has(node)) {
      // do nothing
    } else {
      throw new Error('Unintended condition in topoSort!')
    }
  }
  while (unprocessed.length > 0) {
    step(unprocessed.pop())
  }
  return output
}

export const SLOT_ORDERED = topoSort(SLOT_INHERITANCE)

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

  console.log(bgIsLight, textIsLight)

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

const generateColors = (themeData) => {
  const rawOpacity = Object.assign({
    panel: 1,
    btn: 1,
    border: 1,
    bg: 1,
    badge: 1,
    text: 1,
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

  // Cycle one: just whatever we have
  const sourceColors = Object.entries(inputColors).reduce((acc, [k, v]) => {
    if (typeof v === 'object') {
      acc[k] = v
    } else {
      let value = v
      if (v === 'transparent') {
        // TODO: hack to keep rest of the code from complaining
        value = '#FF00FF'
      }
      acc[k] = hex2rgb(value)
    }
    return acc
  }, {})

  const isLightOnDark = convert(sourceColors.bg).hsl.l < convert(sourceColors.text).hsl.l
  const mod = isLightOnDark ? 1 : -1

  const colors = SLOT_ORDERED.reduce((acc, key) => {
    const value = SLOT_INHERITANCE[key]
    if (sourceColors[key]) {
      return { ...acc, [key]: { ...sourceColors[key] } }
    } else if (typeof value === 'string' && value.startsWith('#')) {
      return { ...acc, [key]: convert(value).rgb }
    } else {
      const isObject = typeof value === 'object'
      const defaultColorFunc = (mod, dep) => ({ ...dep })
      const deps = getDependencies(key, SLOT_INHERITANCE)
      const colorFunc = (isObject && value.color) || defaultColorFunc

      if (value.textColor) {
        const bg = alphaBlendLayers(
          { ...acc[deps[0]] },
          getLayers(
            value.layer,
            value.variant || value.layer,
            acc,
            opacity
          )
        )
        if (value.textColor === 'bw') {
          return {
            ...acc,
            [key]: contrastRatio(bg)
          }
        } else {
          return {
            ...acc,
            [key]: getTextColor(
              bg,
              { ...acc[deps[0]] },
              value.textColor === 'preserve'
            )
          }
        }
      } else {
        console.log('BENIS', key, deps, deps.map((dep) => ({ ...acc[dep] })))
        return {
          ...acc,
          [key]: colorFunc(
            mod,
            ...deps.map((dep) => ({ ...acc[dep] }))
          )
        }
      }
    }
  }, {})

  // Inheriting opacities
  Object.entries(opacity).forEach(([ k, v ]) => {
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
    if (k === 'badge') {
      colors['badgeNotification'].a = v
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

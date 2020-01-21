import { times } from 'lodash'
import { convert } from 'chromatism'
import { rgb2hex, hex2rgb, rgba2css, getCssColor } from '../color_convert/color_convert.js'
import { getColors, computeDynamicColor } from '../theme_data/theme_data.service.js'

// While this is not used anymore right now, I left it in if we want to do custom
// styles that aren't just colors, so user can pick from a few different distinct
// styles as well as set their own colors in the future.

export const setStyle = (href) => {
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

export const applyTheme = (input) => {
  const { rules } = generatePreset(input)
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
}

export const getCssShadow = (input, usesDropShadow) => {
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

export const generateColors = (themeData) => {
  const sourceColors = themeData.colors || themeData

  const isLightOnDark = convert(sourceColors.bg).hsl.l < convert(sourceColors.text).hsl.l
  const mod = isLightOnDark ? 1 : -1

  const { colors, opacity } = getColors(sourceColors, themeData.opacity || {}, mod)

  const htmlColors = Object.entries(colors)
    .reduce((acc, [k, v]) => {
      if (!v) return acc
      acc.solid[k] = rgb2hex(v)
      acc.complete[k] = typeof v.a === 'undefined' ? rgb2hex(v) : rgba2css(v)
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
    },
    mod
  }
}

export const generateRadii = (input) => {
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

export const generateFonts = (input) => {
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

export const DEFAULT_SHADOWS = {
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
  }]
}
export const generateShadows = (input, colors, mod) => {
  const shadows = Object.entries({
    ...DEFAULT_SHADOWS,
    ...(input.shadows || {})
  }).reduce((shadowsAcc, [slotName, shadowDefs]) => {
    const newShadow = shadowDefs.reduce((shadowAcc, def) => [
      ...shadowAcc,
      {
        ...def,
        color: rgb2hex(computeDynamicColor(
          def.color,
          (variableSlot) => convert(colors[variableSlot]).rgb,
          mod
        ))
      }
    ], [])
    return { ...shadowsAcc, [slotName]: newShadow }
  }, {})

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

export const composePreset = (colors, radii, shadows, fonts) => {
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

export const generatePreset = (input) => {
  const colors = generateColors(input)
  return composePreset(
    colors,
    generateRadii(input),
    generateShadows(input, colors.theme.colors, colors.mod),
    generateFonts(input)
  )
}

export const getThemes = () => {
  return window.fetch('/static/styles.json')
    .then((data) => data.json())
    .then((themes) => {
      return Object.entries(themes).map(([k, v]) => {
        let promise = null
        if (typeof v === 'object') {
          promise = Promise.resolve(v)
        } else if (typeof v === 'string') {
          promise = window.fetch(v)
            .then((data) => data.json())
            .catch((e) => {
              console.error(e)
              return null
            })
        }
        return [k, promise]
      })
    })
    .then((promises) => {
      return promises
        .reduce((acc, [k, v]) => {
          acc[k] = v
          return acc
        }, {})
    })
}

/**
 * This handles compatibility issues when importing v2 theme's shadows to current format
 *
 * Back in v2 shadows allowed you to use dynamic colors however those used pure CSS3 variables
 */
export const shadows2to3 = (shadows) => {
  return Object.entries(shadows).reduce((shadowsAcc, [slotName, shadowDefs]) => {
    const isDynamic = ({ color }) => color.startsWith('--')
    const newShadow = shadowDefs.reduce((shadowAcc, def) => [
      ...shadowAcc,
      {
        ...def,
        alpha: isDynamic(def) ? 1 : def.alpha
      }
    ], [])
    return { ...shadowsAcc, [slotName]: newShadow }
  }, {})
}

export const getPreset = (val) => {
  return getThemes()
    .then((themes) => themes[val] ? themes[val] : themes['pleroma-dark'])
    .then((theme) => {
      const isV1 = Array.isArray(theme)
      const data = isV1 ? {} : theme.theme

      if (isV1) {
        const bg = hex2rgb(theme[1])
        const fg = hex2rgb(theme[2])
        const text = hex2rgb(theme[3])
        const link = hex2rgb(theme[4])

        const cRed = hex2rgb(theme[5] || '#FF0000')
        const cGreen = hex2rgb(theme[6] || '#00FF00')
        const cBlue = hex2rgb(theme[7] || '#0000FF')
        const cOrange = hex2rgb(theme[8] || '#E3FF00')

        data.colors = { bg, fg, text, link, cRed, cBlue, cGreen, cOrange }
      }

      return { theme: data, source: theme.source }
    })
}

export const setPreset = (val) => getPreset(val).then(data => applyTheme(data.theme))

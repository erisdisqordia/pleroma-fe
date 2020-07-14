import { convert } from 'chromatism'
import { rgb2hex, hex2rgb, rgba2css, getCssColor, relativeLuminance } from '../color_convert/color_convert.js'
import { getColors, computeDynamicColor, getOpacitySlot } from '../theme_data/theme_data.service.js'

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
  const sourceColors = !themeData.themeEngineVersion
    ? colors2to3(themeData.colors || themeData)
    : themeData.colors || themeData

  const { colors, opacity } = getColors(sourceColors, themeData.opacity || {})

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
    }
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
    attachment: 5,
    chatMessage: inputRadii.panel
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
export const generateShadows = (input, colors) => {
  // TODO this is a small hack for `mod` to work with shadows
  // this is used to get the "context" of shadow, i.e. for `mod` properly depend on background color of element
  const hackContextDict = {
    button: 'btn',
    panel: 'bg',
    top: 'topBar',
    popup: 'popover',
    avatar: 'bg',
    panelHeader: 'panel',
    input: 'input'
  }
  const inputShadows = input.shadows && !input.themeEngineVersion
    ? shadows2to3(input.shadows, input.opacity)
    : input.shadows || {}
  const shadows = Object.entries({
    ...DEFAULT_SHADOWS,
    ...inputShadows
  }).reduce((shadowsAcc, [slotName, shadowDefs]) => {
    const slotFirstWord = slotName.replace(/[A-Z].*$/, '')
    const colorSlotName = hackContextDict[slotFirstWord]
    const isLightOnDark = relativeLuminance(convert(colors[colorSlotName]).rgb) < 0.5
    const mod = isLightOnDark ? 1 : -1
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
      // TODO for v2.2: if shadow doesn't have non-inset shadows with spread > 0 - optionally
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
  const cache = 'no-store'

  return window.fetch('/static/styles.json', { cache })
    .then((data) => data.json())
    .then((themes) => {
      return Object.entries(themes).map(([k, v]) => {
        let promise = null
        if (typeof v === 'object') {
          promise = Promise.resolve(v)
        } else if (typeof v === 'string') {
          promise = window.fetch(v, { cache })
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
export const colors2to3 = (colors) => {
  return Object.entries(colors).reduce((acc, [slotName, color]) => {
    const btnPositions = ['', 'Panel', 'TopBar']
    switch (slotName) {
      case 'lightBg':
        return { ...acc, highlight: color }
      case 'btnText':
        return {
          ...acc,
          ...btnPositions
            .reduce(
              (statePositionAcc, position) =>
                ({ ...statePositionAcc, ['btn' + position + 'Text']: color })
              , {}
            )
        }
      default:
        return { ...acc, [slotName]: color }
    }
  }, {})
}

/**
 * This handles compatibility issues when importing v2 theme's shadows to current format
 *
 * Back in v2 shadows allowed you to use dynamic colors however those used pure CSS3 variables
 */
export const shadows2to3 = (shadows, opacity) => {
  return Object.entries(shadows).reduce((shadowsAcc, [slotName, shadowDefs]) => {
    const isDynamic = ({ color }) => color.startsWith('--')
    const getOpacity = ({ color }) => opacity[getOpacitySlot(color.substring(2).split(',')[0])]
    const newShadow = shadowDefs.reduce((shadowAcc, def) => [
      ...shadowAcc,
      {
        ...def,
        alpha: isDynamic(def) ? getOpacity(def) || 1 : def.alpha
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

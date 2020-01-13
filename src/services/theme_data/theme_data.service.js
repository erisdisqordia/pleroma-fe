import { convert, brightness, contrastRatio } from 'chromatism'
import { alphaBlend, alphaBlendLayers, getTextColor, mixrgb } from '../color_convert/color_convert.js'

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
  lightBg: 'bg',
  panel: 'bg',
  btn: 'bg',
  btnPanel: 'panel',
  btnTopBar: 'topBar',
  input: 'bg',
  inputPanel: 'panel',
  inputTopBar: 'topBar',
  alert: 'bg',
  alertPanel: 'panel',
  poll: 'bg'
}

export const DEFAULT_OPACITY = {
  panel: 1,
  btn: 1,
  border: 1,
  bg: 1,
  badge: 1,
  text: 1,
  alert: 0.5,
  input: 0.5,
  faint: 0.5,
  underlay: 0.15,
  poll: 1,
  topBar: 1
}

export const SLOT_INHERITANCE = {
  bg: {
    depends: [],
    priority: 1
  },
  fg: {
    depends: [],
    priority: 1
  },
  text: {
    depends: [],
    priority: 1
  },
  underlay: '#000000',
  link: {
    depends: ['accent'],
    priority: 1
  },
  accent: {
    depends: ['link'],
    priority: 1
  },
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
  lightBgFaintText: {
    depends: ['faint'],
    layer: 'lightBg',
    textColor: true
  },
  lightBgFaintLink: {
    depends: ['faintLink'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  lightBgText: {
    depends: ['text'],
    layer: 'lightBg',
    textColor: true
  },
  lightBgLink: {
    depends: ['link'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  lightBgIcon: {
    depends: ['lightBg', 'lightBgText'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  selectedPost: '--lightBg',
  selectedPostFaintText: {
    depends: ['lightBgFaintText'],
    layer: 'lightBg',
    textColor: true
  },
  selectedPostFaintLink: {
    depends: ['lightBgFaintLink'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  selectedPostText: {
    depends: ['lightBgText'],
    layer: 'lightBg',
    textColor: true
  },
  selectedPostLink: {
    depends: ['lightBgLink'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  selectedPostIcon: {
    depends: ['selectedPost', 'selectedPostText'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  selectedMenu: '--lightBg',
  selectedMenuFaintText: {
    depends: ['lightBgFaintText'],
    layer: 'lightBg',
    textColor: true
  },
  selectedMenuFaintLink: {
    depends: ['lightBgFaintLink'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  selectedMenuText: {
    depends: ['lightBgText'],
    layer: 'lightBg',
    textColor: true
  },
  selectedMenuLink: {
    depends: ['lightBgLink'],
    layer: 'lightBg',
    textColor: 'preserve'
  },
  selectedMenuIcon: {
    depends: ['selectedMenu', 'selectedMenuText'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  lightText: {
    depends: ['text'],
    color: (mod, text) => brightness(20 * mod, text).rgb
  },

  border: {
    depends: ['fg'],
    color: (mod, fg) => brightness(2 * mod, fg).rgb
  },

  poll: {
    depends: ['accent', 'bg'],
    color: (mod, accent, bg) => alphaBlend(accent, 0.4, bg)
  },
  pollText: {
    depends: ['text'],
    layer: 'poll',
    textColor: true
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
    layer: 'btn',
    textColor: true
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

  btnPressed: '--btn',
  btnPressedText: {
    depends: ['btnText'],
    layer: 'btn',
    variant: 'btnPressed',
    textColor: true
  },
  btnPressedPanelText: {
    depends: ['btnPanelText'],
    layer: 'btnPanel',
    variant: 'btnPressed',
    textColor: true
  },
  btnPressedTopBarText: {
    depends: ['btnTopBarText'],
    layer: 'btnTopBar',
    variant: 'btnPressed',
    textColor: true
  },

  btnDisabled: {
    depends: ['btn', 'bg'],
    color: (mod, btn, bg) => alphaBlend(btn, 0.5, bg)
  },
  btnDisabledText: {
    depends: ['btnText'],
    layer: 'btn',
    variant: 'btnDisabled',
    textColor: true,
    color: (mod, text) => brightness(mod * -60, text).rgb
  },
  btnDisabledPanelText: {
    depends: ['btnPanelText'],
    layer: 'btnPanel',
    variant: 'btnDisabled',
    textColor: true,
    color: (mod, text) => brightness(mod * -60, text).rgb
  },
  btnDisabledTopBarText: {
    depends: ['btnTopBarText'],
    layer: 'btnTopBar',
    variant: 'btnDisabled',
    textColor: true,
    color: (mod, text) => brightness(mod * -60, text).rgb
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
    depends: ['text'],
    layer: 'alert',
    variant: 'alertError',
    textColor: true
  },
  alertErrorPanelText: {
    depends: ['panelText'],
    layer: 'alertPanel',
    variant: 'alertError',
    textColor: true
  },

  alertWarning: '--cOrange',
  alertWarningText: {
    depends: ['text'],
    layer: 'alert',
    variant: 'alertWarning',
    textColor: true
  },
  alertWarningPanelText: {
    depends: ['panelText'],
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
    // TODO: Remove this hack when opacities/layers system is improved
    currentLayer.startsWith('btn')
      ? opacity.btn
      : opacity[currentLayer]
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

export const SLOT_ORDERED = topoSort(
  Object.entries(SLOT_INHERITANCE)
    .sort(([aK, aV], [bK, bV]) => ((aV && aV.priority) || 0) - ((bV && bV.priority) || 0))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
)

console.log(SLOT_ORDERED)

export const getColors = (sourceColors, sourceOpacity, mod) => SLOT_ORDERED.reduce((acc, key) => {
  const value = SLOT_INHERITANCE[key]
  const sourceColor = sourceColors[key]
  if (sourceColor) {
    let targetColor = sourceColor
    if (typeof sourceColor === 'string' && sourceColor.startsWith('--')) {
      const [variable, modifier] = sourceColor.split(/,/g).map(str => str.trim())
      const variableSlot = variable.substring(2)
      targetColor = acc[variableSlot] || sourceColors[variableSlot]
      if (modifier) {
        console.log(targetColor, acc, variableSlot)
        targetColor = brightness(Number.parseFloat(modifier) * mod, targetColor).rgb
      }
      console.log(targetColor, acc, variableSlot)
    }
    return { ...acc, [key]: { ...targetColor } }
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
          sourceOpacity
        )
      )
      if (value.textColor === 'bw') {
        return {
          ...acc,
          [key]: contrastRatio(bg).rgb
        }
      } else {
        let color = { ...acc[deps[0]] }
        if (value.color) {
          const isLightOnDark = convert(bg).hsl.l < convert(color).hsl.l
          const mod = isLightOnDark ? 1 : -1
          color = value.color(mod, ...deps.map((dep) => ({ ...acc[dep] })))
        }

        return {
          ...acc,
          [key]: getTextColor(
            bg,
            { ...color },
            value.textColor === 'preserve'
          )
        }
      }
    } else {
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

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
  underlay: 0.15
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
    depends: ['fg'],
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

export const getColors = (sourceColors, sourceOpacity, mod) => SLOT_ORDERED.reduce((acc, key) => {
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
          sourceOpacity
        )
      )
      if (value.textColor === 'bw') {
        return {
          ...acc,
          [key]: contrastRatio(bg).rgb
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

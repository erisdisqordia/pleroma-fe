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
  alert: 0.5,
  input: 0.5,
  faint: 0.5,
  underlay: 0.15
}

export const SLOT_INHERITANCE = {
  bg: {
    depends: [],
    opacity: 'bg',
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
  underlay: {
    default: '#000000',
    opacity: 'underlay'
  },
  link: {
    depends: ['accent'],
    priority: 1
  },
  accent: {
    depends: ['link'],
    priority: 1
  },
  faint: {
    depends: ['text'],
    opacity: 'faint'
  },
  faintLink: {
    depends: ['link'],
    opacity: 'faint'
  },

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
    opacity: 'border',
    color: (mod, fg) => brightness(2 * mod, fg).rgb
  },

  poll: {
    depends: ['accent', 'bg'],
    copacity: 'poll',
    color: (mod, accent, bg) => alphaBlend(accent, 0.4, bg)
  },
  pollText: {
    depends: ['text'],
    layer: 'poll',
    textColor: true
  },

  icon: {
    depends: ['bg', 'text'],
    inheritsOpacity: false,
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
  panel: {
    depends: ['fg'],
    opacity: 'panel'
  },
  panelText: {
    depends: ['fgText'],
    layer: 'panel',
    textColor: true
  },
  panelFaint: {
    depends: ['fgText'],
    layer: 'panel',
    opacity: 'faint',
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

  // Tabs
  tab: '--btn',
  tabText: {
    depends: ['btnText'],
    layer: 'btn',
    textColor: true
  },
  tabActiveText: {
    depends: ['text'],
    layer: 'bg',
    textColor: true
  },

  // Buttons
  btn: {
    depends: ['fg'],
    opacity: 'btn'
  },
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

  // Buttons: pressed
  btnPressed: '--btn',
  btnPressedText: {
    depends: ['btnText'],
    layer: 'btn',
    variant: 'btnPressed',
    textColor: true
  },
  btnPressedPanel: {
    depends: ['btnPressed']
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

  // Buttons: toggled
  btnToggled: {
    depends: ['btn'],
    color: (mod, btn) => brightness(mod * 20, btn).rgb
  },
  btnToggledText: {
    depends: ['btnText'],
    layer: 'btn',
    variant: 'btnToggled',
    textColor: true
  },
  btnToggledPanelText: {
    depends: ['btnPanelText'],
    layer: 'btnPanel',
    variant: 'btnToggled',
    textColor: true
  },
  btnToggledTopBarText: {
    depends: ['btnTopBarText'],
    layer: 'btnTopBar',
    variant: 'btnToggled',
    textColor: true
  },

  // Buttons: disabled
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
  input: {
    depends: ['fg'],
    opacity: 'input'
  },
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

  alertError: {
    depends: ['cRed'],
    opacity: 'alert'
  },
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

  alertWarning: {
    depends: ['cOrange'],
    opacity: 'alert'
  },
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

export const getLayers = (layer, variant = layer, opacitySlot, colors, opacity) => {
  return getLayersArray(layer).map((currentLayer) => ([
    currentLayer === layer
      ? colors[variant]
      : colors[currentLayer],
    currentLayer === layer
      ? opacity[opacitySlot] || 1
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

export const getOpacitySlot = (
  v,
  inheritance = SLOT_INHERITANCE,
  getDeps = getDependencies
) => {
  const value = typeof v === 'string'
    ? {
      depends: v.startsWith('--') ? [v.substring(2)] : []
    }
    : v
  if (value.opacity === null) return
  if (value.opacity) return v.opacity
  const findInheritedOpacity = (val) => {
    const depSlot = val.depends[0]
    if (depSlot === undefined) return
    const dependency = getDeps(depSlot, inheritance)[0]
    if (dependency === undefined) return
    if (dependency.opacity || dependency === null) {
      return dependency.opacity
    } else if (dependency.depends) {
      return findInheritedOpacity(dependency)
    } else {
      return null
    }
  }
  if (value.depends) {
    return findInheritedOpacity(value)
  }
}

export const getLayerSlot = (
  k,
  v,
  inheritance = SLOT_INHERITANCE,
  getDeps = getDependencies
) => {
  const value = typeof v === 'string'
    ? {
      depends: v.startsWith('--') ? [v.substring(2)] : []
    }
    : v
  if (LAYERS[k]) return k
  if (value.layer === null) return
  if (value.layer) return v.layer
  const findInheritedLayer = (val) => {
    const depSlot = val.depends[0]
    if (depSlot === undefined) return
    const dependency = getDeps(depSlot, inheritance)[0]
    if (dependency === undefined) return
    if (dependency.layer || dependency === null) {
      return dependency.layer
    } else if (dependency.depends) {
      return findInheritedLayer(dependency)
    } else {
      return null
    }
  }
  if (value.depends) {
    return findInheritedLayer(value)
  }
}

export const SLOT_ORDERED = topoSort(
  Object.entries(SLOT_INHERITANCE)
    .sort(([aK, aV], [bK, bV]) => ((aV && aV.priority) || 0) - ((bV && bV.priority) || 0))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
)

export const SLOTS_OPACITIES_DICT = Object.entries(SLOT_INHERITANCE).reduce((acc, [k, v]) => {
  const opacity = getOpacitySlot(v, SLOT_INHERITANCE, getDependencies)
  if (opacity) {
    return { ...acc, [k]: opacity }
  } else {
    return acc
  }
}, {})

export const OPACITIES = Object.entries(SLOT_INHERITANCE).reduce((acc, [k, v]) => {
  const opacity = getOpacitySlot(v, SLOT_INHERITANCE, getDependencies)
  if (opacity) {
    return {
      ...acc,
      [opacity]: {
        defaultValue: DEFAULT_OPACITY[opacity] || 1,
        affectedSlots: [...((acc[opacity] && acc[opacity].affectedSlots) || []), k]
      }
    }
  } else {
    return acc
  }
}, {})

export const getColors = (sourceColors, sourceOpacity, mod) => SLOT_ORDERED.reduce(({ colors, opacity }, key) => {
  const value = SLOT_INHERITANCE[key]
  const isObject = typeof value === 'object'
  const isString = typeof value === 'string'
  const sourceColor = sourceColors[key]
  let outputColor = null
  if (sourceColor) {
    // Color is defined in source color
    let targetColor = sourceColor
    if (targetColor === 'transparent') {
      // We take only layers below current one
      const layers = getLayers(
        getLayerSlot(key, value),
        key,
        value.opacity || key,
        colors,
        opacity
      ).slice(0, -1)
      targetColor = {
        // TODO: try to use alpha-blended background here
        ...alphaBlendLayers(
          convert('#FF00FF').rgb,
          layers
        ),
        a: 0
      }
    } else if (typeof sourceColor === 'string' && sourceColor.startsWith('--')) {
      // Color references other color
      const [variable, modifier] = sourceColor.split(/,/g).map(str => str.trim())
      const variableSlot = variable.substring(2)
      targetColor = colors[variableSlot] || sourceColors[variableSlot]
      if (modifier) {
        targetColor = brightness(Number.parseFloat(modifier) * mod, targetColor).rgb
      }
    } else if (typeof sourceColor === 'string' && sourceColor.startsWith('#')) {
      targetColor = convert(targetColor).rgb
    }
    outputColor = { ...targetColor }
  } else if (isString && value.startsWith('#')) {
    // slot: '#000000' shorthand
    outputColor = convert(value).rgb
  } else if (isObject && value.default) {
    // same as above except in object form
    outputColor = convert(value.default).rgb
  } else {
    // calculate color
    const defaultColorFunc = (mod, dep) => ({ ...dep })
    const deps = getDependencies(key, SLOT_INHERITANCE)
    const colorFunc = (isObject && value.color) || defaultColorFunc

    if (value.textColor) {
      // textColor case
      const bg = alphaBlendLayers(
        { ...colors[deps[0]] },
        getLayers(
          value.layer,
          value.variant || value.layer,
          getOpacitySlot(SLOT_INHERITANCE[value.variant || value.layer]),
          colors,
          opacity
        )
      )
      if (value.textColor === 'bw') {
        outputColor = contrastRatio(bg).rgb
      } else {
        let color = { ...colors[deps[0]] }
        if (value.color) {
          const isLightOnDark = convert(bg).hsl.l < convert(color).hsl.l
          const mod = isLightOnDark ? 1 : -1
          color = value.color(mod, ...deps.map((dep) => ({ ...colors[dep] })))
        }

        outputColor = getTextColor(
          bg,
          { ...color },
          value.textColor === 'preserve'
        )
      }
    } else {
      // background color case
      outputColor = colorFunc(
        mod,
        ...deps.map((dep) => ({ ...colors[dep] }))
      )
    }
  }
  if (!outputColor) {
    throw new Error('Couldn\'t generate color for ' + key)
  }
  const opacitySlot = SLOTS_OPACITIES_DICT[key]
  if (opacitySlot && outputColor.a === undefined) {
    outputColor.a = sourceOpacity[opacitySlot] || OPACITIES[opacitySlot].defaultValue || 1
  }
  if (opacitySlot) {
    return {
      colors: { ...colors, [key]: outputColor },
      opacity: { ...opacity, [opacitySlot]: outputColor.a }
    }
  } else {
    return {
      colors: { ...colors, [key]: outputColor },
      opacity
    }
  }
}, { colors: {}, opacity: {} })

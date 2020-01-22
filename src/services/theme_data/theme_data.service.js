import { convert, brightness, contrastRatio } from 'chromatism'
import { alphaBlend, alphaBlendLayers, getTextColor, mixrgb } from '../color_convert/color_convert.js'

/*
 * # What's all this?
 * Here be theme engine for pleromafe. All of this supposed to ease look
 * and feel customization, making widget styles and make developer's life
 * easier when it comes to supporting themes. Like many other theme systems
 * it operates on color definitions, or "slots" - for example you define
 * "button" color slot and then in UI component Button's CSS you refer to
 * it as a CSS3 Variable.
 *
 * Some applications allow you to customize colors for certain things.
 * Some UI toolkits allow you to define colors for each type of widget.
 * Most of them are pretty barebones and have no assistance for common
 * problems and cases, and in general themes themselves are very hard to
 * maintain in all aspects. This theme engine tries to solve all of the
 * common problems with themes.
 *
 * You don't have redefine several similar colors if you just want to
 * change one color - all color slots are derived from other ones, so you
 * can have at least one or two "basic" colors defined and have all other
 * components inherit and modify basic ones.
 *
 * You don't have to test contrast ratio for colors or pick text color for
 * each element even if you have light-on-dark elements in dark-on-light
 * theme.
 *
 * You don't have to maintain order of code for inheriting slots from othet
 * slots - dependency graph resolving does it for you.
 */

/* This indicates that this version of code outputs similar theme data and
 * should be incremented if output changes - for instance if getTextColor
 * function changes and older themes no longer render text colors as
 * author intended previously.
 */
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
  highlight: 'bg',
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

/* By default opacity slots have 1 as default opacity
 * this allows redefining it to something else
 */
export const DEFAULT_OPACITY = {
  alert: 0.5,
  input: 0.5,
  faint: 0.5,
  underlay: 0.15
}

/**  SUBJECT TO CHANGE IN THE FUTURE, this is all beta
 * Color and opacity slots definitions. Each key represents a slot.
 *
 * Short-hands:
 * String beginning with `--` - value after dashes treated as sole
 *     dependency - i.e. `--value` equivalent to { depends: ['value']}
 * String beginning with `#` - value would be treated as solid color
 *     defined in hexadecimal representation (i.e. #FFFFFF) and will be
 *     used as default. `#FFFFFF` is equivalent to { default: '#FFFFFF'}
 *
 * Full definition:
 * @property {String[]} depends - color slot names this color depends ones.
 *   cyclic dependencies are supported to some extent but not recommended.
 * @property {String} [opacity] - opacity slot used by this color slot.
 *   opacity is inherited from parents. To break inheritance graph use null
 * @property {Number} [priority] - EXPERIMENTAL. used to pre-sort slots so
 *   that slots with higher priority come earlier
 * @property {Function(mod, ...colors)} [color] - function that will be
 *   used to determine the color. By default it just copies first color in
 *   dependency list.
 * @argument {Number} mod - `1` (light-on-dark) or `-1` (dark-on-light)
 *   depending on background color (for textColor)/given color.
 * @argument {...Object} deps - each argument after mod represents each
 *   color from `depends` array. All colors take user customizations into
 *   account and represented by { r, g, b } objects.
 * @returns {Object} resulting color, should be in { r, g, b } form
 *
 * @property {Boolean|String} [textColor] - true to mark color slot as text
 *   color. This enables automatic text color generation for the slot. Use
 *   'preserve' string if you don't want text color to fall back to
 *   black/white. Use 'bw' to only ever use black or white. This also makes
 *   following properties required:
 * @property {String} [layer] - which layer the text sit on top on - used
 *   to account for transparency in text color calculation
 *   layer is inherited from parents. To break inheritance graph use null
 * @property {String} [variant] - which color slot is background (same as
 *   above, used to account for transparency)
 */
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

  highlight: {
    depends: ['bg'],
    color: (mod, bg) => brightness(5 * mod, bg).rgb
  },
  highlightFaintText: {
    depends: ['faint'],
    layer: 'highlight',
    textColor: true
  },
  highlightFaintLink: {
    depends: ['faintLink'],
    layer: 'highlight',
    textColor: 'preserve'
  },
  highlightText: {
    depends: ['text'],
    layer: 'highlight',
    textColor: true
  },
  highlightLink: {
    depends: ['link'],
    layer: 'highlight',
    textColor: 'preserve'
  },
  highlightIcon: {
    depends: ['highlight', 'highlightText'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  selectedPost: '--highlight',
  selectedPostFaintText: {
    depends: ['highlightFaintText'],
    layer: 'highlight',
    variant: 'selectedPost',
    textColor: true
  },
  selectedPostFaintLink: {
    depends: ['highlightFaintLink'],
    layer: 'highlight',
    variant: 'selectedPost',
    textColor: 'preserve'
  },
  selectedPostText: {
    depends: ['highlightText'],
    layer: 'highlight',
    variant: 'selectedPost',
    textColor: true
  },
  selectedPostLink: {
    depends: ['highlightLink'],
    layer: 'highlight',
    variant: 'selectedPost',
    textColor: 'preserve'
  },
  selectedPostIcon: {
    depends: ['selectedPost', 'selectedPostText'],
    color: (mod, bg, text) => mixrgb(bg, text)
  },

  selectedMenu: '--highlight',
  selectedMenuFaintText: {
    depends: ['highlightFaintText'],
    layer: 'highlight',
    variant: 'selectedMenu',
    textColor: true
  },
  selectedMenuFaintLink: {
    depends: ['highlightFaintLink'],
    layer: 'highlight',
    variant: 'selectedMenu',
    textColor: 'preserve'
  },
  selectedMenuText: {
    depends: ['highlightText'],
    layer: 'highlight',
    variant: 'selectedMenu',
    textColor: true
  },
  selectedMenuLink: {
    depends: ['highlightLink'],
    layer: 'highlight',
    variant: 'selectedMenu',
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
    depends: ['text'],
    layer: 'panel',
    textColor: true
  },
  panelFaint: {
    depends: ['text'],
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
    depends: ['text'],
    layer: 'topBar',
    textColor: true
  },
  topBarLink: {
    depends: ['fgLink'],
    layer: 'topBar',
    textColor: 'preserve'
  },

  // Tabs
  tab: {
    depends: ['btn']
  },
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
    depends: ['text'],
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

/**
 * Sorts inheritance object topologically - dependant slots come after
 * dependencies
 *
 * @property {Object} inheritance - object defining the nodes
 * @property {Function} getDeps - function that returns dependencies for
 *   given value and inheritance object.
 * @returns {String[]} keys of inheritance object, sorted in topological
 *   order. Additionally, dependency-less nodes will always be first in line
 */
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
  return output.sort((a, b) => {
    const depsA = getDeps(a, inheritance).length
    const depsB = getDeps(b, inheritance).length

    if (depsA === depsB || (depsB !== 0 && depsA !== 0)) return 0
    if (depsA === 0 && depsB !== 0) return -1
    if (depsB === 0 && depsA !== 0) return 1
  })
}

const expandSlotValue = (value) => {
  if (typeof value === 'object') return value
  return {
    depends: value.startsWith('--') ? [value.substring(2)] : [],
    default: value.startsWith('#') ? value : undefined
  }
}
/**
 * retrieves opacity slot for given slot. This goes up the depenency graph
 * to find which parent has opacity slot defined for it.
 * TODO refactor this
 */
export const getOpacitySlot = (
  k,
  inheritance = SLOT_INHERITANCE,
  getDeps = getDependencies
) => {
  const value = expandSlotValue(inheritance[k])
  if (value.opacity === null) return
  if (value.opacity) return value.opacity
  const findInheritedOpacity = (key, visited = [k]) => {
    const depSlot = getDeps(key, inheritance)[0]
    if (depSlot === undefined) return
    const dependency = inheritance[depSlot]
    if (dependency === undefined) return
    if (dependency.opacity || dependency === null) {
      return dependency.opacity
    } else if (dependency.depends && visited.includes(depSlot)) {
      return findInheritedOpacity(depSlot, [...visited, depSlot])
    } else {
      return null
    }
  }
  if (value.depends) {
    return findInheritedOpacity(k)
  }
}

/**
 * retrieves layer slot for given slot. This goes up the depenency graph
 * to find which parent has opacity slot defined for it.
 * this is basically copypaste of getOpacitySlot except it checks if key is
 * in LAYERS
 * TODO refactor this
 */
export const getLayerSlot = (
  k,
  inheritance = SLOT_INHERITANCE,
  getDeps = getDependencies
) => {
  const value = expandSlotValue(inheritance[k])
  if (LAYERS[k]) return k
  if (value.layer === null) return
  if (value.layer) return value.layer
  const findInheritedLayer = (key, visited = [k]) => {
    const depSlot = getDeps(key, inheritance)[0]
    if (depSlot === undefined) return
    const dependency = inheritance[depSlot]
    if (dependency === undefined) return
    if (dependency.layer || dependency === null) {
      return dependency.layer
    } else if (dependency.depends) {
      return findInheritedLayer(dependency, [...visited, depSlot])
    } else {
      return null
    }
  }
  if (value.depends) {
    return findInheritedLayer(k)
  }
}

/**
 * topologically sorted SLOT_INHERITANCE
 */
export const SLOT_ORDERED = topoSort(
  Object.entries(SLOT_INHERITANCE)
    .sort(([aK, aV], [bK, bV]) => ((aV && aV.priority) || 0) - ((bV && bV.priority) || 0))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
)

/**
 * All opacity slots used in color slots, their default values and affected
 * color slots.
 */
export const OPACITIES = Object.entries(SLOT_INHERITANCE).reduce((acc, [k, v]) => {
  const opacity = getOpacitySlot(k, SLOT_INHERITANCE, getDependencies)
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

/**
 * Handle dynamic color
 */
export const computeDynamicColor = (sourceColor, getColor, mod) => {
  if (typeof sourceColor !== 'string' || !sourceColor.startsWith('--')) return sourceColor
  let targetColor = null
  // Color references other color
  const [variable, modifier] = sourceColor.split(/,/g).map(str => str.trim())
  const variableSlot = variable.substring(2)
  targetColor = getColor(variableSlot)
  if (modifier) {
    targetColor = brightness(Number.parseFloat(modifier) * mod, targetColor).rgb
  }
  return targetColor
}

/**
 * THE function you want to use. Takes provided colors and opacities, mod
 * value and uses inheritance data to figure out color needed for the slot.
 */
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
        getLayerSlot(key),
        key,
        getOpacitySlot(key) || key,
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
      targetColor = computeDynamicColor(
        sourceColor,
        variableSlot => colors[variableSlot] || sourceColors[variableSlot],
        mod
      )
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
          getOpacitySlot(value.variant || value.layer),
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
  const opacitySlot = getOpacitySlot(key)
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

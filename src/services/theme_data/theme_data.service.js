import { convert, brightness, contrastRatio } from 'chromatism'
import { alphaBlendLayers, getTextColor, relativeLuminance } from '../color_convert/color_convert.js'
import { LAYERS, DEFAULT_OPACITY, SLOT_INHERITANCE } from './pleromafe.js'

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

  // The index thing is to make sorting stable on browsers
  // where Array.sort() isn't stable
  return output.map((data, index) => ({ data, index })).sort(({ data: a, index: ai }, { data: b, index: bi }) => {
    const depsA = getDeps(a, inheritance).length
    const depsB = getDeps(b, inheritance).length

    if (depsA === depsB || (depsB !== 0 && depsA !== 0)) return ai - bi
    if (depsA === 0 && depsB !== 0) return -1
    if (depsB === 0 && depsA !== 0) return 1
  }).map(({ data }) => data)
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
 * THE function you want to use. Takes provided colors and opacities
 * value and uses inheritance data to figure out color needed for the slot.
 */
export const getColors = (sourceColors, sourceOpacity) => SLOT_ORDERED.reduce(({ colors, opacity }, key) => {
  const sourceColor = sourceColors[key]
  const value = expandSlotValue(SLOT_INHERITANCE[key])
  const deps = getDependencies(key, SLOT_INHERITANCE)
  const isTextColor = !!value.textColor
  const variant = value.variant || value.layer

  let backgroundColor = null

  if (isTextColor) {
    backgroundColor = alphaBlendLayers(
      { ...(colors[deps[0]] || convert(sourceColors[key] || '#FF00FF').rgb) },
      getLayers(
        getLayerSlot(key) || 'bg',
        variant || 'bg',
        getOpacitySlot(variant),
        colors,
        opacity
      )
    )
  } else if (variant && variant !== key) {
    backgroundColor = colors[variant] || convert(sourceColors[variant]).rgb
  } else {
    backgroundColor = colors.bg || convert(sourceColors.bg)
  }

  const isLightOnDark = relativeLuminance(backgroundColor) < 0.5
  const mod = isLightOnDark ? 1 : -1

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
  } else if (value.default) {
    // same as above except in object form
    outputColor = convert(value.default).rgb
  } else {
    // calculate color
    const defaultColorFunc = (mod, dep) => ({ ...dep })
    const colorFunc = value.color || defaultColorFunc

    if (value.textColor) {
      if (value.textColor === 'bw') {
        outputColor = contrastRatio(backgroundColor).rgb
      } else {
        let color = { ...colors[deps[0]] }
        if (value.color) {
          color = colorFunc(mod, ...deps.map((dep) => ({ ...colors[dep] })))
        }
        outputColor = getTextColor(
          backgroundColor,
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

  const opacitySlot = value.opacity || getOpacitySlot(key)
  const ownOpacitySlot = value.opacity

  if (ownOpacitySlot === null) {
    outputColor.a = 1
  } else if (sourceColor === 'transparent') {
    outputColor.a = 0
  } else {
    const opacityOverriden = ownOpacitySlot && sourceOpacity[opacitySlot] !== undefined

    const dependencySlot = deps[0]
    const dependencyColor = dependencySlot && colors[dependencySlot]

    if (!ownOpacitySlot && dependencyColor && !value.textColor && ownOpacitySlot !== null) {
      // Inheriting color from dependency (weird, i know)
      // except if it's a text color or opacity slot is set to 'null'
      outputColor.a = dependencyColor.a
    } else if (!dependencyColor && !opacitySlot) {
      // Remove any alpha channel if no dependency and no opacitySlot found
      delete outputColor.a
    } else {
      // Otherwise try to assign opacity
      if (dependencyColor && dependencyColor.a === 0) {
        // transparent dependency shall make dependents transparent too
        outputColor.a = 0
      } else {
        // Otherwise check if opacity is overriden and use that or default value instead
        outputColor.a = Number(
          opacityOverriden
            ? sourceOpacity[opacitySlot]
            : (OPACITIES[opacitySlot] || {}).defaultValue
        )
      }
    }
  }

  if (Number.isNaN(outputColor.a) || outputColor.a === undefined) {
    outputColor.a = 1
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

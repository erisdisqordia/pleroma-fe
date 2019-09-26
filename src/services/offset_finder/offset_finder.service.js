export const findOffset = (child, parent, { top = 0, left = 0 } = {}, ignorePadding = true) => {
  const result = {
    top: top + child.offsetTop,
    left: left + child.offsetLeft
  }
  if (!ignorePadding && child !== window) {
    const { topPadding, leftPadding } = findPadding(child)
    result.top += ignorePadding ? 0 : topPadding
    result.left += ignorePadding ? 0 : leftPadding
  }

  if (child.offsetParent && (parent === window || parent.contains(child.offsetParent) || parent === child.offsetParent)) {
    return findOffset(child.offsetParent, parent, result, false)
  } else {
    if (parent !== window) {
      const { topPadding, leftPadding } = findPadding(parent)
      result.top += topPadding
      result.left += leftPadding
    }
    return result
  }
}

const findPadding = (el) => {
  const topPaddingStr = window.getComputedStyle(el)['padding-top']
  const topPadding = Number(topPaddingStr.substring(0, topPaddingStr.length - 2))
  const leftPaddingStr = window.getComputedStyle(el)['padding-left']
  const leftPadding = Number(leftPaddingStr.substring(0, leftPaddingStr.length - 2))

  return { topPadding, leftPadding }
}

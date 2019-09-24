export const findOffset = (child, parent, { top = 0, left = 0 } = {}, ignorePadding = true) => {
  const result = {
    top: top + child.offsetTop,
    left: left + child.offsetLeft
  }
  if (!ignorePadding && child !== window) {
    const topPaddingStr = window.getComputedStyle(child)['padding-top']
    const topPadding = Number(topPaddingStr.substring(0, topPaddingStr.length - 2))
    const leftPaddingStr = window.getComputedStyle(child)['padding-left']
    const leftPadding = Number(leftPaddingStr.substring(0, leftPaddingStr.length - 2))
    result.top += ignorePadding ? 0 : topPadding
    result.left += ignorePadding ? 0 : leftPadding
  }

  if (child.offsetParent && (parent === window || parent.contains(child.offsetParent))) {
    return findOffset(child.offsetParent, parent, result, false)
  } else {
    return result
  }
}

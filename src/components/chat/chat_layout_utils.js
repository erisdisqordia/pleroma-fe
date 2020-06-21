// Captures a scroll position
export const getScrollPosition = (el) => {
  return {
    scrollTop: el.scrollTop,
    scrollHeight: el.scrollHeight,
    offsetHeight: el.offsetHeight
  }
}

// A helper function that is used to keep the scroll position fixed as the new elements are added to the top
// Takes two scroll positions, before and after the update.
export const getNewTopPosition = (previousPosition, newPosition) => {
  return previousPosition.scrollTop + (newPosition.scrollHeight - previousPosition.scrollHeight)
}

export const isBottomedOut = (el, offset = 0) => {
  if (!el) { return }
  const scrollHeight = el.scrollTop + offset
  const totalHeight = el.scrollHeight - el.offsetHeight
  return totalHeight <= scrollHeight
}

// Height of the scrollable container. The dynamic height is needed to ensure the mobile browser panel doesn't overlap or hide the posting form.
export const scrollableContainerHeight = (inner, header, footer) => {
  return inner.offsetHeight - header.clientHeight - footer.clientHeight
}

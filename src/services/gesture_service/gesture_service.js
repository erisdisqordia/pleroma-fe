
const DIRECTION_LEFT = [-1, 0]
const DIRECTION_RIGHT = [1, 0]
const DIRECTION_UP = [0, -1]
const DIRECTION_DOWN = [0, 1]

const deltaCoord = (oldCoord, newCoord) => [newCoord[0] - oldCoord[0], newCoord[1] - oldCoord[1]]

const touchEventCoord = e => ([e.touches[0].screenX, e.touches[0].screenY])

const vectorLength = v => Math.sqrt(v[0] * v[0] + v[1] * v[1])

const perpendicular = v => [v[1], -v[0]]

const dotProduct = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]

const project = (v1, v2) => {
  const scalar = (dotProduct(v1, v2) / dotProduct(v2, v2))
  return [scalar * v2[0], scalar * v2[1]]
}

// direction: either use the constants above or an arbitrary 2d vector.
// threshold: how many Px to move from touch origin before checking if the
//    callback should be called.
// divergentTolerance: a scalar for much of divergent direction we tolerate when
//    above threshold. for example, with 1.0 we only call the callback if
//    divergent component of delta is < 1.0 * direction component of delta.
const swipeGesture = (direction, onSwipe, threshold = 30, perpendicularTolerance = 1.0) => {
  return {
    direction,
    onSwipe,
    threshold,
    perpendicularTolerance,
    _startPos: [0, 0],
    _swiping: false
  }
}

const beginSwipe = (event, gesture) => {
  gesture._startPos = touchEventCoord(event)
  gesture._swiping = true
}

const updateSwipe = (event, gesture) => {
  if (!gesture._swiping) return
  // movement too small
  const delta = deltaCoord(gesture._startPos, touchEventCoord(event))
  if (vectorLength(delta) < gesture.threshold) return
  // movement is opposite from direction
  if (dotProduct(delta, gesture.direction) < 0) return
  // movement perpendicular to direction is too much
  const towardsDir = project(delta, gesture.direction)
  const perpendicularDir = perpendicular(gesture.direction)
  const towardsPerpendicular = project(delta, perpendicularDir)
  if (
    vectorLength(towardsDir) * gesture.perpendicularTolerance <
    vectorLength(towardsPerpendicular)
  ) return

  gesture.onSwipe()
  gesture._swiping = false
}

const GestureService = {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN,
  swipeGesture,
  beginSwipe,
  updateSwipe
}

export default GestureService

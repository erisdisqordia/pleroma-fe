import GestureService from 'src/services/gesture_service/gesture_service.js'

const mockTouchEvent = (x, y) => ({
  touches: [
    {
      screenX: x,
      screenY: y
    }
  ]
})

describe('GestureService', () => {
  describe('swipeGesture', () => {
    it('calls the callback on a successful swipe', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(200, 100), gesture)

      expect(swiped).to.eql(true)
    })

    it('calls the callback only once per begin', () => {
      let hits = 0
      const callback = () => { hits += 1 }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(150, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(200, 100), gesture)

      expect(hits).to.eql(1)
    })

    it('doesn\'t call the callback on an opposite swipe', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(0, 100), gesture)

      expect(swiped).to.eql(false)
    })

    it('doesn\'t call the callback on a swipe below threshold', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback,
        100
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(150, 100), gesture)

      expect(swiped).to.eql(false)
    })

    it('doesn\'t call the callback on a perpendicular swipe', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback,
        30,
        0.5
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(150, 200), gesture)

      expect(swiped).to.eql(false)
    })

    it('calls the callback on perpendicular swipe if within tolerance', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        GestureService.DIRECTION_RIGHT,
        callback,
        30,
        2.0
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(150, 150), gesture)

      expect(swiped).to.eql(true)
    })

    it('works with any arbitrary 2d directions', () => {
      let swiped = false
      const callback = () => { swiped = true }
      const gesture = GestureService.swipeGesture(
        [-1, -1],
        callback,
        30,
        0.1
      )

      GestureService.beginSwipe(mockTouchEvent(100, 100), gesture)
      GestureService.updateSwipe(mockTouchEvent(60, 60), gesture)

      expect(swiped).to.eql(true)
    })
  })
})

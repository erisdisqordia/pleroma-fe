import { getExcludedStatusIdsByPinning } from 'src/components/timeline/timeline.js'
import { difference } from 'lodash'

describe('Timeline', () => {
  describe('getExcludedStatusIdsByPinning', () => {
    it('should not return unpinned status ids', () => {
      const statuses = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ]
      const pinnedStatusIds = [1, 3]
      expect(difference(getExcludedStatusIdsByPinning(statuses, pinnedStatusIds), pinnedStatusIds)).to.eql([])
    })
  })
})
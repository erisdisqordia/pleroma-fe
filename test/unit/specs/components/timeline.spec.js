import { getExcludedStatusIdsByPinning } from 'src/components/timeline/timeline.js'

describe('Timeline', () => {
  describe('getExcludedStatusIdsByPinning', () => {
    const mockStatuses = (ids) => ids.map(id => ({ id }))

    it('should return only members of both pinnedStatusIds and ids of the given statuses', () => {
      const statusIds = [1, 2, 3, 4]
      const statuses = mockStatuses(statusIds)
      const pinnedStatusIds = [1, 3, 5]
      const result = getExcludedStatusIdsByPinning(statuses, pinnedStatusIds)
      result.forEach(item => {
        expect(item).to.be.oneOf(statusIds)
        expect(item).to.be.oneOf(pinnedStatusIds)
      })
    })

    it('should return ids of pinned statuses not posted before any unpinned status', () => {
      const pinnedStatusIdSet1 = ['PINNED1', 'PINNED2']
      const pinnedStatusIdSet2 = ['PINNED3', 'PINNED4']
      const pinnedStatusIds = [...pinnedStatusIdSet1, ...pinnedStatusIdSet2]
      const statusIds = [...pinnedStatusIdSet1, 'UNPINNED1', ...pinnedStatusIdSet2]
      const statuses = mockStatuses(statusIds)
      expect(getExcludedStatusIdsByPinning(statuses, pinnedStatusIds)).to.eql(pinnedStatusIdSet1)
    })
  })
})

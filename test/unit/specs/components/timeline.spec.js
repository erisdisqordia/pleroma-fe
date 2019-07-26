import { getExcludedStatusIdsByPinning } from 'src/components/timeline/timeline.js'

describe('Timeline', () => {
  describe('getExcludedStatusIdsByPinning', () => {
    const mockStatuses = (ids) => ids.map(id => ({ id }))

    it('should not return any unpinned status ids', () => {
      const statuses = mockStatuses([1, 2, 3, 4])
      const pinnedStatusIds = [1, 3, 5]
      expect(pinnedStatusIds).to.include.members(getExcludedStatusIdsByPinning(statuses, pinnedStatusIds))
    })

    it('should not return any status ids not listed in the given statuses', () => {
      const statusIds = [1, 2, 3, 4]
      const statuses = mockStatuses(statusIds)
      const pinnedStatusIds = [1, 3, 5]
      expect(statusIds).to.include.members(getExcludedStatusIdsByPinning(statuses, pinnedStatusIds))
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

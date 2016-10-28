import { map, slice, last, intersectionBy, sortBy, unionBy, toInteger, groupBy, differenceBy, each, find } from 'lodash'
import moment from 'moment'

const defaultState = {
  allStatuses: [],
  maxId: 0,
  timelines: {
    public: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0
    },
    publicAndExternal: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0
    },
    friends: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0
    }
  }
}

const statusType = (status) => {
  return !status.is_post_verb && status.uri.match(/fave/) ? 'fave' : 'status'
}

const addStatusesToTimeline = (addedStatuses, showImmediately, { statuses, visibleStatuses, newStatusCount, faves }) => {
  const statusesAndFaves = groupBy(addedStatuses, statusType)
  const addedFaves = statusesAndFaves['fave'] || []
  const unseenFaves = differenceBy(addedFaves, faves, 'id')

  // Update fave count
  each(unseenFaves, ({in_reply_to_status_id}) => {
    const status = find(statuses, { id: toInteger(in_reply_to_status_id) })
    if (status) {
      status.fave_num += 1
    }
  })

  addedStatuses = statusesAndFaves['status'] || []

  // Add some html and nsfw to the statuses.
  each(addedStatuses, (status) => {
    const statusoid = status.retweeted_status || status
    if (statusoid.parsedText === undefined) {
     // statusoid.parsedText =  statusParserService.parse(statusoid)
      statusoid.parsedText = statusoid.text
    }

    if (statusoid.nsfw === undefined) {
      const nsfwRegex = /#nsfw/i
      statusoid.nsfw = statusoid.text.match(nsfwRegex)
    }
  })

  const newStatuses = sortBy(
    unionBy(addedStatuses, statuses, 'id'),
    ({id}) => -id
  )

  let newNewStatusCount = newStatusCount + (newStatuses.length - statuses.length)

  let newVisibleStatuses = visibleStatuses

  if (showImmediately) {
    newVisibleStatuses = unionBy(addedStatuses, newVisibleStatuses, 'id')
    newVisibleStatuses = sortBy(newVisibleStatuses, ({id}) => -id)
    newNewStatusCount = newStatusCount
  };

  newVisibleStatuses = intersectionBy(newStatuses, newVisibleStatuses, 'id')

  return {
    statuses: newStatuses,
    visibleStatuses: newVisibleStatuses,
    newStatusCount: newNewStatusCount,
    maxId: newStatuses[0].id,
    minVisibleId: (last(newVisibleStatuses) || { id: undefined }).id,
    faves: unionBy(faves, addedFaves, 'id')
  }
}

const updateTimestampsInStatuses = (statuses) => {
  return map(statuses, (statusoid) => {
    const status = statusoid.retweeted_status || statusoid

    // Parse date
    status.created_at_parsed = moment(status.created_at).fromNow()
    return status
  })
}

const statuses = {
  state: defaultState,
  mutations: {
    addNewStatuses (state, { statuses, showImmediately = false, timeline }) {
      state.timelines[timeline] = addStatusesToTimeline(statuses, showImmediately, state.timelines[timeline])
      state.allStatuses = unionBy(state.timelines[timeline].statuses, state.allStatuses.id)
    },
    showNewStatuses (state, { timeline }) {
      const oldTimeline = (state.timelines[timeline])

      oldTimeline.newStatusCount = 0
      oldTimeline.visibleStatuses = slice(oldTimeline.statuses, 0, 50)
    },
    updateTimestamps (state) {
      updateTimestampsInStatuses(state.allStatuses)
    },
    setNsfw (state, { id, nsfw }) {
      // For now, walk through all the statuses because the stuff might be in the replied_to_status
      // TODO: Save the replied_tos as references.
      each(state.allStatuses, (statusoid) => {
        const status = statusoid.retweeted_status || statusoid
        if (status.id === id) {
          status.nsfw = nsfw
        }
      })
    }
  }
}

export default statuses

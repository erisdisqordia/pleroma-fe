import { cloneDeep } from 'lodash'
import { defaultState, mutations, findMaxId, prepareStatus } from '../../../../src/modules/statuses.js'

const makeMockStatus = ({id, text, is_post_verb = true}) => {
  return {
    id,
    user: {id: 0},
    name: 'status',
    text: text || `Text number ${id}`,
    fave_num: 0,
    uri: '',
    is_post_verb
  }
}

describe('Statuses.prepareStatus', () => {
  it('sets nsfw for statuses with the #nsfw tag', () => {
    const safe = makeMockStatus({id: 1, text: 'Hello oniichan'})
    const nsfw = makeMockStatus({id: 1, text: 'Hello oniichan #nsfw'})

    expect(prepareStatus(safe).nsfw).to.eq(false)
    expect(prepareStatus(nsfw).nsfw).to.eq(true)
  })

  it('leaves existing nsfw settings alone', () => {
    const nsfw = makeMockStatus({id: 1, text: 'Hello oniichan #nsfw'})
    nsfw.nsfw = false

    expect(prepareStatus(nsfw).nsfw).to.eq(false)
  })

  it('sets the created_at_parsed property', () => {
    const status = makeMockStatus({id: 1})
    status.created_at = ''
    expect(status.created_at_parsed).to.eq(undefined)

    const prepared = prepareStatus(status)
    expect(prepared.created_at_parsed).to.not.eq(undefined)
  })
})

describe('Statuses.findMaxId', () => {
  it('returns the largest id in any of the given arrays', () => {
    const statusesOne = [{ id: 100 }, { id: 2 }]
    const statusesTwo = [{ id: 3 }]

    const maxId = findMaxId(statusesOne, statusesTwo)
    expect(maxId).to.eq(100)
  })

  it('returns undefined for empty arrays', () => {
    const maxId = findMaxId([], [])
    expect(maxId).to.eq(undefined)
  })
})

describe('The Statuses module', () => {
  it('adds the status to allStatuses and to the given timeline', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status], timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(1)
  })

  it('adds the status to allStatuses and to the given timeline, directly visible', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([status])
    expect(state.timelines.public.newStatusCount).to.equal(0)
  })

  it('removes statuses by tag on deletion', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    status.uri = 'xxx'
    const deletion = makeMockStatus({id: 2, is_post_verb: false})
    deletion.text = 'Dolus deleted notice {{tag:gs.smuglo.li,2016-11-18:noticeId=1038007:objectType=note}}.'
    deletion.uri= 'xxx'

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [deletion], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([])
    expect(state.timelines.public.statuses).to.eql([])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.maxId).to.eql(2)
  })

  it('keeps a descending by id order in timeline.visibleStatuses and timeline.statuses', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 2})
    const statusTwo = makeMockStatus({id: 1})
    const statusThree = makeMockStatus({id: 3})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [statusTwo], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.minVisibleId).to.equal(1)

    mutations.addNewStatuses(state, { statuses: [statusThree], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.statuses).to.eql([statusThree, status, statusTwo])
    expect(state.timelines.public.visibleStatuses).to.eql([statusThree, status, statusTwo])
  })

  it('splits retweets from their status and links them', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const retweet = makeMockStatus({id: 2, is_post_verb: false})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})

    retweet.retweeted_status = status

    // It adds both statuses, but only the retweet to visible.
    mutations.addNewStatuses(state, { statuses: [retweet], timeline: 'public', showImmediately: true })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.timelines.public.statuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal(1)
    expect(state.allStatuses[1].id).to.equal(2)

    // It refers to the modified status.
    mutations.addNewStatuses(state, { statuses: [modStatus], timeline: 'public' })
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal(1)
    expect(state.allStatuses[0].text).to.equal(modStatus.text)
    expect(state.allStatuses[1].id).to.equal(2)
    expect(retweet.retweeted_status.text).to.eql(modStatus.text)
  })

  it('replaces existing statuses with the same id', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})

    // Add original status
    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)

    // Add new version of status
    mutations.addNewStatuses(state, { statuses: [modStatus], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)
    expect(state.allStatuses[0].text).to.eql(modStatus.text)
  })

  it('replaces existing statuses with the same id, coming from a retweet', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})
    const retweet = makeMockStatus({id: 2, is_post_verb: false})
    retweet.retweeted_status = modStatus

    // Add original status
    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)

    // Add new version of status
    mutations.addNewStatuses(state, { statuses: [retweet], showImmediately: false, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    // Don't add the retweet itself if the tweet is visible
    expect(state.timelines.public.statuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].text).to.eql(modStatus.text)
  })

  it('handles favorite actions', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    const favorite = {
      id: 2,
      is_post_verb: false,
      in_reply_to_status_id: '1', // The API uses strings here...
      uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
      text: 'a favorited something by b'
    }

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [favorite], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.visibleStatuses.length).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].fave_num).to.eql(1)
    expect(state.timelines.public.maxId).to.eq(favorite.id)
  })

  describe('notifications', () => {
    it('adds a notfication when one of the user\'s status is favorited', () => {
      const state = cloneDeep(defaultState)
      const status = makeMockStatus({id: 1})
      const user = {id: 1}
      status.user = user

      const favorite = {
        id: 2,
        is_post_verb: false,
        in_reply_to_status_id: '1', // The API uses strings here...
        uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
        text: 'a favorited something by b'
      }

      mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public', user })
      mutations.addNewStatuses(state, { statuses: [favorite], showImmediately: true, timeline: 'public', user })

      expect(state.notifications).to.have.length(1)
    })
  })
})

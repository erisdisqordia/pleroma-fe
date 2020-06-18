const fetchRelationship = (attempt, userId, store) => new Promise((resolve, reject) => {
  setTimeout(() => {
    store.state.api.backendInteractor.fetchUserRelationship({ id: userId })
      .then((relationship) => {
        store.commit('updateUserRelationship', [relationship])
        return relationship
      })
      .then((relationship) => resolve([relationship.following, relationship.requested, relationship.locked, attempt]))
      .catch((e) => reject(e))
  }, 500)
}).then(([following, sent, locked, attempt]) => {
  if (!following && !(locked && sent) && attempt <= 3) {
    // If we BE reports that we still not following that user - retry,
    // increment attempts by one
    fetchRelationship(++attempt, userId, store)
  }
})

export const requestFollow = (userId, store) => new Promise((resolve, reject) => {
  store.state.api.backendInteractor.followUser({ id: userId })
    .then((updated) => {
      store.commit('updateUserRelationship', [updated])

      if (updated.following || (updated.locked && updated.requested)) {
        // If we get result immediately or the account is locked, just stop.
        resolve()
        return
      }

      // But usually we don't get result immediately, so we ask server
      // for updated user profile to confirm if we are following them
      // Sometimes it takes several tries. Sometimes we end up not following
      // user anyway, probably because they locked themselves and we
      // don't know that yet.
      // Recursive Promise, it will call itself up to 3 times.

      return fetchRelationship(1, updated, store)
        .then(() => {
          resolve()
        })
    })
})

export const requestUnfollow = (userId, store) => new Promise((resolve, reject) => {
  store.state.api.backendInteractor.unfollowUser({ id: userId })
    .then((updated) => {
      store.commit('updateUserRelationship', [updated])
      resolve({
        updated
      })
    })
})

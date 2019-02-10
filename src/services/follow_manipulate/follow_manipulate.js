const fetchUser = (attempt, user, store) => new Promise((resolve, reject) => {
  setTimeout(() => {
    store.state.api.backendInteractor.fetchUser({ id: user.id })
      .then((user) => store.commit('addNewUsers', [user]))
      .then(() => resolve([user.following, attempt]))
      .catch((e) => reject(e))
  }, 500)
}).then(([following, attempt]) => {
  if (!following && attempt <= 3) {
    // If we BE reports that we still not following that user - retry,
    // increment attempts by one
    return fetchUser(++attempt, user, store)
  } else {
    // If we run out of attempts, just return whatever status is.
    return following
  }
})

export const requestFollow = (user, store) => new Promise((resolve, reject) => {
  store.state.api.backendInteractor.followUser(user.id)
    .then((updated) => {
      store.commit('addNewUsers', [updated])

      // For locked users we just mark it that we sent the follow request
      if (updated.locked) {
        resolve({
          sent: true,
          updated
        })
      }

      if (updated.following) {
        // If we get result immediately, just stop.
        resolve({
          sent: false,
          updated
        })
      }

      // But usually we don't get result immediately, so we ask server
      // for updated user profile to confirm if we are following them
      // Sometimes it takes several tries. Sometimes we end up not following
      // user anyway, probably because they locked themselves and we
      // don't know that yet.
      // Recursive Promise, it will call itself up to 3 times.

      return fetchUser(1, user, store)
        .then((following) => {
          if (following) {
            // We confirmed and everything's good.
            resolve({
              sent: false,
              updated
            })
          } else {
            // If after all the tries, just treat it as if user is locked
            resolve({
              sent: false,
              updated
            })
          }
        })
    })
})

export const requestUnfollow = (user, store) => new Promise((resolve, reject) => {
  store.state.api.backendInteractor.unfollowUser(user.id)
    .then((updated) => {
      store.commit('addNewUsers', [updated])
      resolve({
        updated
      })
    })
})

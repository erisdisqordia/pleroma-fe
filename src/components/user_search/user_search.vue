<template>
  <div class="user-search panel panel-default">
    <div class="panel-heading">
      {{$t('nav.user_search')}}
    </div>
    <div class="user-search-input-container">
      <input class="user-finder-input" ref="userSearchInput" @keyup.enter="newQuery(username)" v-model="username" :placeholder="$t('finder.find_user')"/>
      <button class="btn search-button" @click="newQuery(username)">
        <i class="icon-search"/>
      </button>
    </div>
    <div v-if="loading" class="text-center loading-icon">
      <i class="icon-spin3 animate-spin"/>
    </div>
    <div v-else class="panel-body">
      <FollowCard v-for="user in users" :key="user.id" :user="user"/>
    </div>
  </div>
</template>

<script src="./user_search.js"></script>

<style lang="scss">
.user-search-input-container {
  margin: 0.5em;
  display: flex;
  justify-content: center;

  .search-button {
    margin-left: 0.5em;
  }
}

.loading-icon {
  padding: 1em;
}
</style>

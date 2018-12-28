<template>
  <div class="user-search panel panel-default">
    <div class="panel-heading">
      {{$t('nav.user_search')}}
    </div>
    <div class="user-search-input-container">
      <input class="user-finder-input" @keyup.enter="newQuery(username)" v-model="username" :placeholder="$t('finder.find_user')"/>
      <button class="btn search-button" @click="newQuery(username)">
        <i class="icon-search"/>
      </button>
    </div>
    <div class="panel-body">
      <user-card v-for="user in users" :key="user.id" :user="user" :showFollows="true"></user-card>
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
</style>

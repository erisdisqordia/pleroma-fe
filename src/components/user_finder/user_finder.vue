<template>
  <div>
    <div class="user-finder-container">
      <i class="icon-spin4 user-finder-icon animate-spin-slow" v-if="loading" />
      <a href="#" v-if="hidden" :title="$t('finder.find_user')"><i class="icon-user-plus user-finder-icon" @click.prevent.stop="toggleHidden" /></a>
      <template v-else>
        <input class="user-finder-input" @keyup.enter="findUser(username)" v-model="username" :placeholder="$t('finder.find_user')" id="user-finder-input" type="text"/>
        <button class="btn search-button" @click="findUser(username)">
          <i class="icon-search"/>
        </button>
        <i class="button-icon icon-cancel user-finder-icon" @click.prevent.stop="toggleHidden"/>
      </template>
    </div>
  </div>
</template>

<script src="./user_finder.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-finder-container {
  max-width: 100%;
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;


  .user-finder-input,
  .search-button {
    height: 29px;
  }
  .user-finder-input {
    // TODO: do this properly without a rough guesstimate of 2 icons + paddings
    max-width: calc(100% - 30px - 30px - 20px);
  }

  .search-button {
    margin-left: .5em;
    margin-right: .5em;
  }
}

</style>

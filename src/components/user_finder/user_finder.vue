<template>
  <div>
    <div class="user-finder-container">
      <i
        v-if="loading"
        class="icon-spin4 user-finder-icon animate-spin-slow"
      />
      <a
        v-if="hidden"
        href="#"
        :title="$t('finder.find_user')"
      ><i
        class="icon-user-plus user-finder-icon"
        @click.prevent.stop="toggleHidden"
      /></a>
      <template v-else>
        <input
          id="user-finder-input"
          ref="userSearchInput"
          v-model="username"
          class="user-finder-input"
          :placeholder="$t('finder.find_user')"
          type="text"
          @keyup.enter="findUser(username)"
        >
        <button
          class="btn search-button"
          @click="findUser(username)"
        >
          <i class="icon-search" />
        </button>
        <i
          class="button-icon icon-cancel user-finder-icon"
          @click.prevent.stop="toggleHidden"
        />
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

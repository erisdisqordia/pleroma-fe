<template>
  <div>
    <div class="search-bar-container">
      <i
        v-if="loading"
        class="icon-spin4 finder-icon animate-spin-slow"
      />
      <a
        v-if="hidden"
        href="#"
        :title="$t('nav.search')"
      ><i
        class="button-icon icon-search"
        @click.prevent.stop="toggleHidden"
      /></a>
      <template v-else>
        <input
          id="search-bar-input"
          ref="searchInput"
          v-model="searchTerm"
          class="search-bar-input"
          :placeholder="$t('nav.search')"
          type="text"
          @keyup.enter="find(searchTerm)"
        >
        <button
          class="btn search-button"
          @click="find(searchTerm)"
        >
          <i class="icon-search" />
        </button>
        <i
          class="button-icon icon-cancel"
          @click.prevent.stop="toggleHidden"
        />
      </template>
    </div>
  </div>
</template>

<script src="./search_bar.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.search-bar-container {
  max-width: 100%;
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
  justify-content: flex-end;

  .search-bar-input,
  .search-button {
    height: 29px;
  }

  .search-bar-input {
    // TODO: do this properly without a rough guesstimate of 2 icons + paddings
    max-width: calc(100% - 30px - 30px - 20px);
  }

  .search-button {
    margin-left: .5em;
    margin-right: .5em;
  }

  .icon-cancel {
    cursor: pointer;
  }
}

</style>

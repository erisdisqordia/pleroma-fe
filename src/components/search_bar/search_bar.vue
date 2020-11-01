<template>
  <div
    class="SearchBar"
    :class="{ '-expanded': !hidden }"
  >
    <a
      v-if="hidden"
      href="#"
      class="nav-icon"
      :title="$t('nav.search')"
    ><FAIcon
      fixed-width
      class="fa-scale-110 fa-old-padding"
      icon="search"
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
        <FAIcon
          fixed-width
          icon="search"
        />
      </button>
      <span>
        <FAIcon
          fixed-width
          icon="times"
          class="cancel-icon fa-scale-110 fa-old-padding"
          @click.prevent.stop="toggleHidden"
        />
      </span>
    </template>
  </div>
</template>

<script src="./search_bar.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.SearchBar {
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
  justify-content: flex-end;

  &.-expanded {
    width: 100%;
  }

  .search-bar-input,
  .search-button {
    height: 29px;
  }

  .search-bar-input {
    flex: 1 0 auto;
  }

  .cancel-icon {
    cursor: pointer;
    color: $fallback--text;
    color: var(--btnTopBarText, $fallback--text);
  }
}

</style>

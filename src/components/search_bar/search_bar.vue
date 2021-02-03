<template>
  <div
    class="SearchBar"
    :class="{ '-expanded': !hidden }"
  >
    <button
      v-if="hidden"
      class="button-unstyled nav-icon"
      :title="$t('nav.search')"
      @click.prevent.stop="toggleHidden"
      type="button"
    >
      <FAIcon
        fixed-width
        class="fa-scale-110 fa-old-padding"
        icon="search"
      />
    </button>
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
        class="button-default search-button"
        @click="find(searchTerm)"
        type="submit"
      >
        <FAIcon
          fixed-width
          icon="search"
        />
      </button>
      <button
        class="button-unstyled cancel-search"
        @click.prevent.stop="toggleHidden"
        type="button"
      >
        <FAIcon
          fixed-width
          icon="times"
          class="cancel-icon fa-scale-110 fa-old-padding"
        />
      </button>
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

  .cancel-search {
    height: 50px;
  }

  .cancel-icon {
    color: $fallback--text;
    color: var(--btnTopBarText, $fallback--text);
  }
}

</style>

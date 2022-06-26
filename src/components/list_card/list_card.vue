<template>
  <div class="list-card">
    <router-link
      :to="{ name: 'list-timeline', params: { id: list.id } }"
      class="list-name"
    >
      {{ list.title }}
    </router-link>
    <!-- <router-link
      :to="{ name: 'list-edit', params: { id: list.id } }"
      class="button-list-edit"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="ellipsis-h"
      />
    </router-link> -->
  </div>
</template>

<script src="./list_card.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.list-card {
  display: flex;
}

.list-name,
.button-list-edit {
  margin: 0;
  padding: 1em;
  color: $fallback--link;
  color: var(--link, $fallback--link);

  &:hover {
    background-color: $fallback--lightBg;
    background-color: var(--selectedMenu, $fallback--lightBg);
    color: $fallback--link;
    color: var(--selectedMenuText, $fallback--link);
    --faint: var(--selectedMenuFaintText, $fallback--faint);
    --faintLink: var(--selectedMenuFaintLink, $fallback--faint);
    --lightText: var(--selectedMenuLightText, $fallback--lightText);
  }
}

.list-name {
  flex-grow: 1;
}
</style>

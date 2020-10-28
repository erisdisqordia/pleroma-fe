<template>
  <div v-if="loggedIn">
    <FAIcon
      :class="classes"
      class="FavoriteButton fa-scale-110 fa-old-padding -interactive"
      :title="$t('tool_tip.favorite')"
      :icon="[status.favorited ? 'fas' : 'far', 'star']"
      :spin="animated"
      @click.prevent="favorite()"
    />
    <span v-if="!mergedConfig.hidePostStats && status.fave_num > 0">{{ status.fave_num }}</span>
  </div>
  <div v-else>
    <FAIcon
      :class="classes"
      class="FavoriteButton fa-scale-110 fa-old-padding"
      :title="$t('tool_tip.favorite')"
      :icon="['far', 'star']"
    />
    <span v-if="!mergedConfig.hidePostStats && status.fave_num > 0">{{ status.fave_num }}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.FavoriteButton {
  &.-interactive {
    cursor: pointer;
    animation-duration: 0.6s;

    &:hover {
      color: $fallback--cOrange;
      color: var(--cOrange, $fallback--cOrange);
    }
  }

  &.-favorited {
    color: $fallback--cOrange;
    color: var(--cOrange, $fallback--cOrange);
  }
}
</style>

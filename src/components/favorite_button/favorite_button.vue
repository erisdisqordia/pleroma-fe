<template>
  <div>
    <button
      v-if="loggedIn"
      class="FavoriteButton -interactive button-unstyled -padded"
      :class="status.favorited && '-favorited'"
      :title="$t('tool_tip.favorite')"
      @click.prevent="favorite()"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        :icon="[status.favorited ? 'fas' : 'far', 'star']"
        :spin="animated"
      />
    </button>
    <FAIcon
      v-else
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

    .svg-inline--fa {
      animation-duration: 0.6s;
    }

    &:hover .svg-inline--fa,
    &.-favorited .svg-inline--fa {
      color: $fallback--cOrange;
      color: var(--cOrange, $fallback--cOrange);
    }
  }
}
</style>

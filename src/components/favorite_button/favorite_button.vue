<template>
  <div class="FavoriteButton">
    <button
      v-if="loggedIn"
      class="button-unstyled interactive"
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
    <span v-else>
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        :title="$t('tool_tip.favorite')"
        :icon="['far', 'star']"
      />
    </span>
    <span
      v-if="!mergedConfig.hidePostStats && status.fave_num > 0"
      class="action-counter"
    >
      {{ status.fave_num }}
    </span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.FavoriteButton {
  display: flex;

  > :first-child {
    padding: 10px;
    margin: -10px -8px -10px -10px;
  }

  .action-counter {
    pointer-events: none;
    user-select: none;
  }

  .interactive {
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

<template>
  <div class="BookmarkButton">
    <button
      v-if="loggedIn"
      class="button-unstyled interactive"
      :class="status.bookmarked && '-bookmarked'"
      :title="$t('status.bookmark')"
      @click.prevent="bookmarkStatus()"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        fixed-width
        :icon="[status.bookmarked ? 'fas' : 'far', 'bookmark']"
        :spin="animated"
      />
    </button>
  </div>
</template>

<script src="./bookmark_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.BookmarkButton {
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
    &.-repeated .svg-inline--fa {
      color: $fallback--cGreen;
      color: var(--cGreen, $fallback--cGreen);
    }
  }
}
</style>

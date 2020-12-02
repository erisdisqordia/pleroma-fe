<template>
  <div class="RetweetButton">
    <button
      v-if="visibility !== 'private' && visibility !== 'direct' && loggedIn"
      class="button-unstyled interactive"
      :class="status.repeated && '-repeated'"
      :title="$t('tool_tip.repeat')"
      @click.prevent="retweet()"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="retweet"
        :spin="animated"
      />
    </button>
    <span v-else-if="loggedIn">
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="lock"
        :title="$t('timeline.no_retweet_hint')"
      />
    </span>
    <span v-else>
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="retweet"
        :title="$t('tool_tip.repeat')"
      />
    </span>
    <span
      v-if="!mergedConfig.hidePostStats && status.repeat_num > 0"
      class="no-event"
    >
      {{ status.repeat_num }}
    </span>
  </div>
</template>

<script src="./retweet_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.RetweetButton {
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

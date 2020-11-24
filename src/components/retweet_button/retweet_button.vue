<template>
  <div>
    <button
      v-if="visibility !== 'private' && visibility !== 'direct' && loggedIn"
      class="button-unstyled -padded RetweetButton -interactive"
      :class="status.repeated && '-repeated'"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="retweet"
        :spin="animated"
        :title="$t('tool_tip.repeat')"
        @click.prevent="retweet()"
      />
    </button>
    <FAIcon
      v-else-if="loggedIn"
      :class="classes"
      class="RetweetButton fa-scale-110 fa-old-padding"
      icon="lock"
      :title="$t('timeline.no_retweet_hint')"
    />
    <FAIcon
      v-else
      :class="classes"
      class="RetweetButton fa-scale-110 fa-old-padding"
      icon="retweet"
      :title="$t('tool_tip.repeat')"
    />
    <span v-if="!mergedConfig.hidePostStats && status.repeat_num > 0">{{ status.repeat_num }}</span>
  </div>
</template>

<script src="./retweet_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.RetweetButton {
  &.-interactive {

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

<template>
  <div v-if="loggedIn">
    <template v-if="visibility !== 'private' && visibility !== 'direct'">
      <FAIcon
        :class="classes"
        class="RetweetButton fa-scale-110 fa-old-padding -interactive"
        icon="retweet"
        :spin="animated"
        :title="$t('tool_tip.repeat')"
        @click.prevent="retweet()"
      />
      <span v-if="!mergedConfig.hidePostStats && status.repeat_num > 0">{{ status.repeat_num }}</span>
    </template>
    <template v-else>
      <FAIcon
        :class="classes"
        class="RetweetButton fa-scale-110 fa-old-padding"
        icon="lock"
        :title="$t('timeline.no_retweet_hint')"
      />
    </template>
  </div>
  <div v-else-if="!loggedIn">
    <FAIcon
      :class="classes"
      class="fa-scale-110 fa-old-padding"
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
    cursor: pointer;
    animation-duration: 0.6s;

    &:hover {
      color: $fallback--cGreen;
      color: var(--cGreen, $fallback--cGreen);
    }
  }

  &.-repeated {
    color: $fallback--cGreen;
    color: var(--cGreen, $fallback--cGreen);
  }
}
</style>

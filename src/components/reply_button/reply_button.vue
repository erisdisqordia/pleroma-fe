<template>
  <div>
    <FAIcon
      v-if="loggedIn"
      class="ReplyButton fa-scale-110 fa-old-padding -interactive"
      icon="reply"
      :title="$t('tool_tip.reply')"
      :class="{'-active': replying}"
      @click.prevent="$emit('toggle')"
    />
    <FAIcon
      v-else
      icon="reply"
      class="ReplyButton fa-scale-110 fa-old-padding"
      :title="$t('tool_tip.reply')"
    />
    <span v-if="status.replies_count > 0">
      {{ status.replies_count }}
    </span>
  </div>
</template>

<script src="./reply_button.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.ReplyButton {
  &.-interactive {
    cursor: pointer;

    &:hover,
    &.-active {
      color: $fallback--cBlue;
      color: var(--cBlue, $fallback--cBlue);
    }
  }
}
</style>

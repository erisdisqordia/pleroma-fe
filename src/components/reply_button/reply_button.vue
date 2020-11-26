<template>
  <div class="ReplyButton">
    <button
      v-if="loggedIn"
      class="button-unstyled interactive"
      :class="{'-active': replying}"
      :title="$t('tool_tip.reply')"
      @click.prevent="$emit('toggle')"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="reply"
      />
    </button>
    <span v-else>
      <FAIcon
        icon="reply"
        class="fa-scale-110 fa-old-padding"
        :title="$t('tool_tip.reply')"
      />
    </span>
    <span
      v-if="status.replies_count > 0"
      class="action-counter"
    >
      {{ status.replies_count }}
    </span>
  </div>
</template>

<script src="./reply_button.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.ReplyButton {
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
    &:hover .svg-inline--fa,
    &.-active .svg-inline--fa {
      color: $fallback--cBlue;
      color: var(--cBlue, $fallback--cBlue);
    }
  }

}
</style>

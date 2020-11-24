<template>
  <div>
    <button
      v-if="loggedIn"
      class="button-unstyled ReplyButton -padded -interactive"
      :class="{'-active': replying}"
      :title="$t('tool_tip.reply')"
      @click.prevent="$emit('toggle')"
    >
      <FAIcon
        class="fa-scale-110 fa-old-padding"
        icon="reply"
      />
    </button>
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

    &:hover .svg-inline--fa,
    &.-active .svg-inline--fa {
      color: $fallback--cBlue;
      color: var(--cBlue, $fallback--cBlue);
    }
  }
}
</style>

<template>
  <div>
    <i
      v-if="loggedIn"
      class="button-icon button-reply icon-reply"
      :title="$t('tool_tip.reply')"
      :class="{'-active': replying}"
      @click.prevent="$emit('toggle')"
    />
    <i
      v-else
      class="button-icon button-reply -disabled icon-reply"
      :title="$t('tool_tip.reply')"
    />
    <span v-if="status.replies_count > 0">
      {{ status.replies_count }}
    </span>
  </div>
</template>

<script src="./reply_button.js"></script>

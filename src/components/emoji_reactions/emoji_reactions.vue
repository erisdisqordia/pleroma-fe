<template>
  <div class="emoji-reactions">
    <button
      v-for="(users, emoji) in emojiReactions"
      :key="emoji"
      class="emoji-reaction btn btn-default"
      :class="{ 'picked-reaction': reactedWith(emoji) }"
      @click="emojiOnClick(emoji, $event)"
    >
      <span v-if="users">{{ users.length }}</span>
      <span>{{ emoji }}</span>
    </button>
  </div>
</template>

<script src="./emoji_reactions.js" ></script>
<style lang="scss">
@import '../../_variables.scss';

.emoji-reactions {
  display: flex;
  margin-top: 0.25em;
  flex-wrap: wrap;
}

.emoji-reaction {
  padding: 0 0.5em;
  margin-right: 0.5em;
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  :first-child {
    margin-right: 0.25em;
  }
  :last-child {
    width: 1.5em;
  }
  &:focus {
    outline: none;
  }
}

.picked-reaction {
  border: 1px solid var(--link, $fallback--link);
  margin-left: -1px; // offset the border, can't use inset shadows either
  margin-right: calc(0.5em - 1px);
}

</style>

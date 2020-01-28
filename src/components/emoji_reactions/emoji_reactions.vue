<template>
  <div class="emoji-reactions">
    <button
      v-for="(reaction) in emojiReactions"
      :key="reaction.emoji"
      class="emoji-reaction btn btn-default"
      :class="{ 'toggled': reactedWith(reaction.emoji) }"
      @click="emojiOnClick(reaction.emoji, $event)"
    >
      <span class="reaction-emoji">{{ reaction.emoji }}</span>
      <span>{{ reaction.count }}</span>
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
  .reaction-emoji {
    width: 1.25em;
    margin-right: 0.25em;
  }
  &:focus {
    outline: none;
  }
}

</style>

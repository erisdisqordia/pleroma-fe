<template>
  <div class="emoji-reactions">
    <UserListPopover
      v-for="(reaction) in emojiReactions"
      :key="reaction.name"
      :users="accountsForEmoji[reaction.name]"
    >
      <button
        class="emoji-reaction btn btn-default"
        :class="{ 'picked-reaction': reactedWith(reaction.name), 'not-clickable': !loggedIn }"
        @click="emojiOnClick(reaction.name, $event)"
        @mouseenter="fetchEmojiReactionsByIfMissing()"
      >
        <span class="reaction-emoji">{{ reaction.name }}</span>
        <span>{{ reaction.count }}</span>
      </button>
    </UserListPopover>
    <a
      v-if="tooManyReactions"
      class="emoji-reaction-expand faint"
      href="javascript:void(0)"
      @click="toggleShowAll"
    >
      {{ showAll ? $t('general.show_less') : showMoreString }}
    </a>
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

  &.not-clickable {
    cursor: default;
    &:hover {
      box-shadow: $fallback--buttonShadow;
      box-shadow: var(--buttonShadow);
    }
  }
}

.emoji-reaction-expand {
  padding: 0 0.5em;
  margin-right: 0.5em;
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    text-decoration: underline;
  }
}

.picked-reaction {
  border: 1px solid var(--accent, $fallback--link);
  margin-left: -1px; // offset the border, can't use inset shadows either
  margin-right: calc(0.5em - 1px);
}

</style>

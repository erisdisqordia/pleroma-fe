<template>
  <div class="emoji-reactions">
    <Popover
      v-for="(reaction) in emojiReactions"
      :key="reaction.name"
      trigger="hover"
      placement="top"
      :offset="{ y: 5 }"
    >
      <div
        slot="content"
        class="reacted-users"
      >
        <div v-if="accountsForEmoji[reaction.name].length">
          <div
            v-for="(account) in accountsForEmoji[reaction.name]"
            :key="account.id"
            class="reacted-user"
          >
            <UserAvatar
              :user="account"
              class="avatar-small"
              :compact="true"
            />
            <div class="reacted-user-names">
              <!-- eslint-disable vue/no-v-html -->
              <span
                class="reacted-user-name"
                v-html="account.name_html"
              />
              <!-- eslint-enable vue/no-v-html -->
              <span class="reacted-user-screen-name">{{ account.screen_name }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <i class="icon-spin4 animate-spin" />
        </div>
      </div>
      <button
        slot="trigger"
        class="emoji-reaction btn btn-default"
        :class="{ 'picked-reaction': reactedWith(reaction.name), 'not-clickable': !loggedIn }"
        @click="emojiOnClick(reaction.name, $event)"
        @mouseenter="fetchEmojiReactionsByIfMissing()"
      >
        <span class="reaction-emoji">{{ reaction.name }}</span>
        <span>{{ reaction.count }}</span>
      </button>
    </Popover>
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

.reacted-users {
  padding: 0.5em;
}

.reacted-user {
  padding: 0.25em;
  display: flex;
  flex-direction: row;

  .reacted-user-names {
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
    min-width: 5em;

    img {
      width: 1em;
      height: 1em;
    }
  }

  .reacted-user-screen-name {
    font-size: 9px;
  }
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

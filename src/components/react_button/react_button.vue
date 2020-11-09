<template>
  <Popover
    trigger="click"
    placement="top"
    :offset="{ y: 5 }"
    class="react-button-popover"
    :bound-to="{ x: 'container' }"
  >
    <div
      slot="content"
      slot-scope="{close}"
    >
      <div class="reaction-picker-filter">
        <input
          v-model="filterWord"
          size="1"
          :placeholder="$t('emoji.search_emoji')"
        >
      </div>
      <div class="reaction-picker">
        <span
          v-for="emoji in commonEmojis"
          :key="emoji"
          class="emoji-button"
          @click="addReaction($event, emoji, close)"
        >
          {{ emoji }}
        </span>
        <div class="reaction-picker-divider" />
        <span
          v-for="(emoji, key) in emojis"
          :key="key"
          class="emoji-button"
          @click="addReaction($event, emoji.replacement, close)"
        >
          {{ emoji.replacement }}
        </span>
        <div class="reaction-bottom-fader" />
      </div>
    </div>
    <span slot="trigger">
      <FAIcon
        class="fa-scale-110 fa-old-padding add-reaction-button"
        :icon="['far', 'smile-beam']"
        :title="$t('tool_tip.add_reaction')"
      />
    </span>
  </Popover>
</template>

<script src="./react_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.reaction-picker-filter {
  padding: 0.5em;
  display: flex;
  input {
    flex: 1;
  }
}

.reaction-picker-divider {
  height: 1px;
  width: 100%;
  margin: 0.5em;
  background-color: var(--border, $fallback--border);
}

.reaction-picker {
  width: 10em;
  height: 9em;
  font-size: 1.5em;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5em;
  text-align: center;
  align-content: flex-start;
  user-select: none;

  mask: linear-gradient(to top, white 0, transparent 100%) bottom no-repeat,
    linear-gradient(to bottom, white 0, transparent 100%) top no-repeat,
    linear-gradient(to top, white, white);
  transition: mask-size 150ms;
  mask-size: 100% 20px, 100% 20px, auto;
  // Autoprefixed seem to ignore this one, and also syntax is different
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  .emoji-button {
    cursor: pointer;

    flex-basis: 20%;
    line-height: 1.5em;
    align-content: center;

    &:hover {
      transform: scale(1.25);
    }
  }
}

.add-reaction-button {
  cursor: pointer;

  &:hover {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}

</style>

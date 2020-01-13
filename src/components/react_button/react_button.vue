<template>
  <v-popover
    :popper-options="popperOptions"
    :open="showTooltip"
    trigger="manual"
    placement="top"
    class="react-button-popover"
    @hide="closeReactionSelect"
  >
    <div slot="popover">
      <div class="reaction-picker-filter">
        <input v-model="filterWord" placeholder="Search...">
      </div>
      <div class="reaction-picker">
        <span
          v-for="emoji in commonEmojis"
          :key="emoji"
          class="emoji-reaction-button"
          @click="addReaction($event, emoji)"
        >
          {{ emoji }}
        </span>
        <div class="reaction-picker-divider" />
        <span
          v-for="(emoji, key) in emojis"
          :key="key"
          class="emoji-reaction-button"
          @click="addReaction($event, emoji.replacement)"
        >
          {{ emoji.replacement }}
        </span>
        <div class="reaction-bottom-fader" />
      </div>
    </div>
    <div
      v-if="loggedIn"
      @click.prevent="toggleReactionSelect"
    >
      <i
        :class="classes"
        class="button-icon favorite-button fav-active"
        :title="$t('tool_tip.add_reaction')"
      />
      <span v-if="!mergedConfig.hidePostStats && status.fave_num > 0">{{ status.fave_num }}</span>
    </div>
  </v-popover>
</template>

<script src="./react_button.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.reaction-picker-filter {
  padding: 0.5em;
}

.reaction-picker-divider {
  height: 1px;
  width: 100%;
  margin: 0.4em;
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
}

.emoji-reaction-button {
  flex-basis: 20%;
  line-height: 1.5em;
  align-content: center;
}

.fav-active {
  cursor: pointer;
  animation-duration: 0.6s;

  &:hover {
    color: $fallback--cOrange;
    color: var(--cOrange, $fallback--cOrange);
  }
}

.favorite-button.icon-star {
  color: $fallback--cOrange;
  color: var(--cOrange, $fallback--cOrange);
}
</style>

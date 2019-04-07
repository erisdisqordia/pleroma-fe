<template>
  <div class="emoji-input">
    <input
      v-if="type !== 'textarea'"
      :class="classname"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
      @click="setCaret"
      @keyup="setCaret"
      @keydown.exact="onKeydown"
      @keydown.down.exact="cycleForward"
      @keydown.up.exact="cycleBackward"
      @keydown.shift.tab.exact="cycleBackward"
      @keydown.tab.exact="cycleForward"
      @keydown.enter.exact="replaceEmoji"
    >
    <textarea
      v-else
      :class="classname"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
      @click="setCaret"
      @keyup="setCaret"
      @keydown.exact="onKeydown"
      @keydown.down.exact="cycleForward"
      @keydown.up.exact="cycleBackward"
      @keydown.shift.tab.exact="cycleBackward"
      @keydown.tab.exact="cycleForward"
      @keydown.enter.exact="replaceEmoji"
    />
    <div
      v-if="suggestions"
      class="autocomplete-panel"
    >
      <div class="autocomplete-panel-body">
        <div
          v-for="(emoji, index) in suggestions"
          :key="index"
          class="autocomplete-item"
          :class="{ highlighted: emoji.highlighted }"
          @click="replace(emoji.utf || (emoji.shortcode + ' '))"
        >
          <span v-if="emoji.img">
            <img :src="emoji.img">
          </span>
          <span v-else>{{ emoji.utf }}</span>
          <span>{{ emoji.shortcode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./emoji-input.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji-input {
  .form-control {
    width: 100%;
  }
}
</style>

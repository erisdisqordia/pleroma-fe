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
      @keydown="onKeydown"
      @keydown.down="cycleForward"
      @keydown.up="cycleBackward"
      @keydown.shift.tab="cycleBackward"
      @keydown.tab="cycleForward"
      @keydown.enter="replaceEmoji"
    />
    <textarea
      v-else
      :class="classname"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
      @click="setCaret"
      @keyup="setCaret"
      @keydown="onKeydown"
      @keydown.down="cycleForward"
      @keydown.up="cycleBackward"
      @keydown.shift.tab="cycleBackward"
      @keydown.tab="cycleForward"
      @keydown.enter="replaceEmoji"
    ></textarea>
    <div class="autocomplete-panel" v-if="suggestions">
      <div class="autocomplete-panel-body">
        <div
          v-for="(emoji, index) in suggestions"
          :key="index"
          @click="replace(emoji.utf || (emoji.shortcode + ' '))"
          class="autocomplete-item"
          :class="{ highlighted: emoji.highlighted }"
        >
          <span v-if="emoji.img">
            <img :src="emoji.img" />
          </span>
          <span v-else>{{emoji.utf}}</span>
          <span>{{emoji.shortcode}}</span>
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

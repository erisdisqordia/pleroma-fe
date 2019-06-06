<template>
  <div class="emoji-input">
    <slot
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
      >
    </slot>
    <div class="autocomplete-panel" v-if="suggestions">
      <div class="autocomplete-panel-body">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="replace(suggestion.replacement)"
          class="autocomplete-item"
          :class="{ highlighted: suggestion.highlighted }"
        >
          <span v-if="suggestion.img">
            <img :src="suggestion.img" />
          </span>
          <span v-else>{{suggestion.replacement}}</span>
          <span>{{suggestion.shortcode}}</span>
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

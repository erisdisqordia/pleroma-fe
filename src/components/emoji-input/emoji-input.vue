<template>
  <div class="emoji-input">
    <input
      class="form-control"
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

.autocomplete {
  &-panel {
    position: relative;

    &-body {
      margin: 0 0.5em 0 0.5em;
      border-radius: $fallback--tooltipRadius;
      border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
      position: absolute;
      z-index: 1;
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
      // this doesn't match original but i don't care, making it uniform.
      box-shadow: var(--popupShadow);
      min-width: 75%;
      background: $fallback--bg;
      background: var(--bg, $fallback--bg);
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }
  }

  &-item {
    cursor: pointer;
    padding: 0.2em 0.4em 0.2em 0.4em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    display: flex;

    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    span {
      line-height: 24px;
      margin: 0 0.1em 0 0.2em;
    }

    small {
      margin-left: .5em;
      color: $fallback--faint;
      color: var(--faint, $fallback--faint);
    }

    &.highlighted {
      background-color: $fallback--fg;
      background-color: var(--lightBg, $fallback--fg);
    }
  }
}
</style>

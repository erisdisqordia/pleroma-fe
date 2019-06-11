<template>
<div class="emoji-input">
  <slot></slot>
  <div ref="panel" class="autocomplete-panel" :class="{ hide: !showPopup }">
    <div class="autocomplete-panel-body">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click.stop.prevent="replaceText"
        class="autocomplete-item"
        :class="{ highlighted: suggestion.highlighted }"
        >
        <span class="image">
          <img v-if="suggestion.img":src="suggestion.img" />
          <span v-else>{{suggestion.replacement}}</span>
        </span>
        <div class="label">
          <span class="displayText">{{suggestion.displayText}}</span>
          <span class="detailText">{{suggestion.detailText}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script src="./emoji-input.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji-input {
  display: flex;
  flex-direction: column;

  .autocomplete {
    &-panel {
      position: absolute;
      z-index: 9;
      margin-top: 2px;

      &.hide {
        display: none
      }

      &-body {
        margin: 0 0.5em 0 0.5em;
        border-radius: $fallback--tooltipRadius;
        border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
        box-shadow: var(--popupShadow);
        min-width: 75%;
        background: $fallback--bg;
        background: var(--bg, $fallback--bg);
        color: $fallback--lightText;
        color: var(--lightText, $fallback--lightText);
      }
    }

    &-item {
      display: flex;
      cursor: pointer;
      padding: 0.2em 0.4em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
      height: 32px;

      .image {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 32px;

        margin-right: 4px;

        img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }
      }

      .label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 0.1em 0 0.2em;

        .displayText {
          line-height: 1.5;
        }

        .detailText {
          font-size: 9px;
          line-height: 9px;
        }
      }

      &.highlighted {
        background-color: $fallback--fg;
        background-color: var(--lightBg, $fallback--fg);
      }
    }
  }


  input, textarea {
    flex: 1 0 auto;
  }
}
</style>

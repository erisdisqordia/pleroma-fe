<template>
  <div
    v-click-outside="onClickOutside"
    class="emoji-input"
    :class="{ 'with-picker': !hideEmojiButton }"
  >
    <slot />
    <template v-if="enableEmojiPicker">
      <div
        v-if="!hideEmojiButton"
        class="emoji-picker-icon"
        @click.prevent="togglePicker"
      >
        <FAIcon :icon="['far', 'smile-beam']" />
      </div>
      <EmojiPicker
        v-if="enableEmojiPicker"
        ref="picker"
        :class="{ hide: !showPicker }"
        :enable-sticker-picker="enableStickerPicker"
        class="emoji-picker-panel"
        @emoji="insert"
        @sticker-uploaded="onStickerUploaded"
        @sticker-upload-failed="onStickerUploadFailed"
      />
    </template>
    <div
      ref="panel"
      class="autocomplete-panel"
      :class="{ hide: !showSuggestions }"
    >
      <div
        ref="panel-body"
        class="autocomplete-panel-body"
      >
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="autocomplete-item"
          :class="{ highlighted: suggestion.highlighted }"
          @click.stop.prevent="onClick($event, suggestion)"
        >
          <span class="image">
            <img
              v-if="suggestion.img"
              :src="suggestion.img"
            >
            <span v-else>{{ suggestion.replacement }}</span>
          </span>
          <div class="label">
            <span class="displayText">{{ suggestion.displayText }}</span>
            <span class="detailText">{{ suggestion.detailText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./emoji_input.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji-input {
  display: flex;
  flex-direction: column;
  position: relative;

  &.with-picker input {
    padding-right: 30px;
  }

  .emoji-picker-icon {
    position: absolute;
    top: 0;
    right: 0;
    margin: .2em .25em;
    font-size: 16px;
    cursor: pointer;
    line-height: 24px;

    &:hover i {
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }
  }
  .emoji-picker-panel {
    position: absolute;
    z-index: 20;
    margin-top: 2px;

    &.hide {
      display: none
    }
  }

  .autocomplete {
    &-panel {
      position: absolute;
      z-index: 20;
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
        background-color: $fallback--bg;
        background-color: var(--popover, $fallback--bg);
        color: $fallback--link;
        color: var(--popoverText, $fallback--link);
        --faint: var(--popoverFaintText, $fallback--faint);
        --faintLink: var(--popoverFaintLink, $fallback--faint);
        --lightText: var(--popoverLightText, $fallback--lightText);
        --postLink: var(--popoverPostLink, $fallback--link);
        --postFaintLink: var(--popoverPostFaintLink, $fallback--link);
        --icon: var(--popoverIcon, $fallback--icon);
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
        background-color: var(--selectedMenuPopover, $fallback--fg);
        color: var(--selectedMenuPopoverText, $fallback--text);
        --faint: var(--selectedMenuPopoverFaintText, $fallback--faint);
        --faintLink: var(--selectedMenuPopoverFaintLink, $fallback--faint);
        --lightText: var(--selectedMenuPopoverLightText, $fallback--lightText);
        --icon: var(--selectedMenuPopoverIcon, $fallback--icon);
      }
    }
  }

  input, textarea {
    flex: 1 0 auto;
  }
}
</style>

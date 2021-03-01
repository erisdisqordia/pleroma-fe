<template>
  <div
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <button
      ref="trigger"
      class="button-unstyled -fullwidth popover-trigger-button"
      type="button"
      @click="onClick"
    >
      <slot name="trigger" />
    </button>
    <div
      v-if="!hidden"
      ref="content"
      :style="styles"
      class="popover"
      :class="popoverClass || 'popover-default'"
    >
      <slot
        name="content"
        class="popover-inner"
        :close="hidePopover"
      />
    </div>
  </div>
</template>

<script src="./popover.js" />

<style lang="scss">
@import '../../_variables.scss';

.popover-trigger-button {
  display: block;
}

.popover {
  z-index: 8;
  position: absolute;
  min-width: 0;
}

.popover-default {
  transition: opacity 0.3s;

  box-shadow: 1px 1px 4px rgba(0,0,0,.6);
  box-shadow: var(--panelShadow);
  border-radius: $fallback--btnRadius;
  border-radius: var(--btnRadius, $fallback--btnRadius);

  background-color: $fallback--bg;
  background-color: var(--popover, $fallback--bg);
  color: $fallback--text;
  color: var(--popoverText, $fallback--text);
  --faint: var(--popoverFaintText, $fallback--faint);
  --faintLink: var(--popoverFaintLink, $fallback--faint);
  --lightText: var(--popoverLightText, $fallback--lightText);
  --postLink: var(--popoverPostLink, $fallback--link);
  --postFaintLink: var(--popoverPostFaintLink, $fallback--link);
  --icon: var(--popoverIcon, $fallback--icon);
}

.dropdown-menu {
  display: block;
  padding: .5rem 0;
  font-size: 1rem;
  text-align: left;
  list-style: none;
  max-width: 100vw;
  z-index: 10;
  white-space: nowrap;

  .dropdown-divider {
    height: 0;
    margin: .5rem 0;
    overflow: hidden;
    border-top: 1px solid $fallback--border;
    border-top: 1px solid var(--border, $fallback--border);
  }

  .dropdown-item {
    line-height: 21px;
    overflow: auto;
    display: block;
    padding: .5em 0.75em;
    clear: both;
    font-weight: 400;
    text-align: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0px;
    background-color: transparent;
    box-shadow: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    --btnText: var(--popoverText, $fallback--text);

    &-icon {
      svg {
        width: 22px;
        margin-right: 0.75rem;
        color: var(--menuPopoverIcon, $fallback--icon)
      }
    }

    &:active, &:hover {
      background-color: $fallback--lightBg;
      background-color: var(--selectedMenuPopover, $fallback--lightBg);
      color: $fallback--link;
      color: var(--selectedMenuPopoverText, $fallback--link);
      --faint: var(--selectedMenuPopoverFaintText, $fallback--faint);
      --faintLink: var(--selectedMenuPopoverFaintLink, $fallback--faint);
      --lightText: var(--selectedMenuPopoverLightText, $fallback--lightText);
      --icon: var(--selectedMenuPopoverIcon, $fallback--icon);
      svg {
        color: var(--selectedMenuPopoverIcon, $fallback--icon);
      }
    }

    .menu-checkbox {
      display: inline-block;
      vertical-align: middle;
      min-width: 22px;
      max-width: 22px;
      min-height: 22px;
      max-height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 0px;
      background-color: $fallback--fg;
      background-color: var(--input, $fallback--fg);
      box-shadow: 0px 0px 2px black inset;
      box-shadow: var(--inputShadow);
      margin-right: 0.75em;

      &.menu-checkbox-checked::after {
        font-size: 1.25em;
        content: '✓';
      }

      &.menu-checkbox-radio::after {
        font-size: 2em;
        content: '•';
      }
    }

  }
}
</style>

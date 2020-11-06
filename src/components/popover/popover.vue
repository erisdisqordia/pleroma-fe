<template>
  <div
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <div
      ref="trigger"
      @click="onClick"
    >
      <slot name="trigger" />
    </div>
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
    margin-right: 5px;
    overflow: auto;
    display: block;
    padding: .25rem 1.0rem .25rem 1.5rem;
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

    --btnText: var(--popoverText, $fallback--text);

    &-icon {
      padding-left: 0.5rem;

      svg {
        margin-right: 0.25rem;
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

  }
}
</style>

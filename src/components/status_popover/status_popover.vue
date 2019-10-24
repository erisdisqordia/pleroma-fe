<template>
  <v-popover
    ref="popper"
    popover-class="status-popover"
    placement="top-start"
    :popper-options="popperOptions"
    @show="enter()"
  >
    <div slot="popover">
      <Status
        v-if="preview"
        :is-preview="true"
        :statusoid="preview"
        :compact="true"
      />
      <div
        v-else
        class="status-preview-loading"
      >
        <i class="icon-spin4 animate-spin" />
      </div>
    </div>

    <slot />
  </v-popover>
</template>

<script src="./status_popover.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.tooltip.popover.status-popover {
  font-size: 1rem;
  min-width: 15em;
  max-width: 95%;
  margin-left: 0.5em;

  .popover-inner {
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    border-style: solid;
    border-width: 1px;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
    box-shadow: var(--popupShadow);
  }

  .popover-arrow::before {
    position: absolute;
    content: '';
    left: -7px;
    border: solid 7px transparent;
    z-index: -1;
  }

  &[x-placement^="bottom-start"] .popover-arrow::before {
    top: -2px;
    border-top-width: 0;
    border-bottom-color: $fallback--border;
    border-bottom-color: var(--border, $fallback--border);
  }

  &[x-placement^="top-start"] .popover-arrow::before {
    bottom: -2px;
    border-bottom-width: 0;
    border-top-color: $fallback--border;
    border-top-color: var(--border, $fallback--border);
  }

  .status-el.status-el {
    border: none;
  }

  .status-preview-loading {
    padding: 1em;
    text-align: center;

    i {
      font-size: 2em;
    }
  }
}

</style>

<template>
  <Popover
    trigger="hover"
    popover-class="popover-default status-popover"
    :bound-to="{ x: 'container' }"
    @show="enter"
  >
    <template slot="trigger">
      <slot />
    </template>
    <div
      slot="content"
    >
      <Status
        v-if="status"
        :is-preview="true"
        :statusoid="status"
        :compact="true"
      />
      <div
        v-else-if="error"
        class="status-preview-no-content faint"
      >
        {{ $t('status.status_unavailable') }}
      </div>
      <div
        v-else
        class="status-preview-no-content"
      >
        <FAIcon
          icon="circle-notch"
          spin
          size="2x"
        />
      </div>
    </div>
  </Popover>
</template>

<script src="./status_popover.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

/* popover styles load on-demand, so we need to override */
.status-popover.popover {
  font-size: 1rem;
  min-width: 15em;
  max-width: 95%;

  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  border-style: solid;
  border-width: 1px;
  border-radius: $fallback--tooltipRadius;
  border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  box-shadow: var(--popupShadow);

  /* TODO cleanup this */
  .Status.Status {
    border: none;
  }

  .status-preview-no-content {
    padding: 1em;
    text-align: center;

    i {
      font-size: 2em;
    }
  }
}

</style>

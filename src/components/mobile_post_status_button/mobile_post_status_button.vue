<template>
  <div v-if="isLoggedIn">
    <button
      class="new-status-button"
      :class="{ 'hidden': isHidden }"
      @click="openPostForm"
    >
      <FAIcon icon="pen" />
    </button>
  </div>
</template>

<script src="./mobile_post_status_button.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.new-status-button {
  width: 5em;
  height: 5em;
  border-radius: 100%;
  position: fixed;
  bottom: 1.5em;
  right: 1.5em;
  // TODO: this needs its own color, it has to stand out enough and link color
  // is not very optimal for this particular use.
  background-color: $fallback--fg;
  background-color: var(--btn, $fallback--fg);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3), 0px 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;

  transition: 0.35s transform;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);

  &.hidden {
    transform: translateY(150%);
  }

  svg {
    font-size: 1.5em;
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}

@media all and (min-width: 801px) {
  .new-status-button {
    display: none;
  }
}

</style>

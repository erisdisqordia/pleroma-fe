<template>
  <span v-bind:class="{ 'dark-overlay': darkOverlay }" @click.self.stop='onCancel()'>
    <div class="dialog-modal panel panel-default" @click.stop=''>
      <div class="panel-heading dialog-modal-heading">
        <div class="title">
          <slot name="header"></slot>
        </div>
      </div>
      <div class="dialog-modal-content">
        <slot name="default"></slot>
      </div>
      <div class="dialog-modal-footer user-interactions panel-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </span>
</template>

<script src="./dialog_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

// TODO: unify with other modals.
.dark-overlay {
  &::before {
    bottom: 0;
    content: " ";
    display: block;
    cursor: default;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    background: rgba(27,31,35,.5);
    z-index: 99;
  }
}

.dialog-modal.panel {
  top: 0;
  left: 50%;
  max-height: 80vh;
  max-width: 90vw;
  margin: 15vh auto;
  position: fixed;
  transform: translateX(-50%);
  z-index: 999;
  cursor: default;
  display: block;
  background-color: $fallback--bg;
  background-color: var(--bg, $fallback--bg);

  .dialog-modal-heading {
    padding: .5em .5em;
    margin-right: auto;
    margin-bottom: 0;
    white-space: nowrap;
    color: var(--panelText);
    background-color: $fallback--fg;
    background-color: var(--panel, $fallback--fg);

    .title {
      margin-bottom: 0;
      text-align: center;
    }
  }

  .dialog-modal-content {
    margin: 0;
    padding: 1rem 1rem;
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
    white-space: normal;
  }

  .dialog-modal-footer {
    margin: 0;
    padding: .5em .5em;
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
    border-top: 1px solid $fallback--bg;
    border-top: 1px solid var(--bg, $fallback--bg);
    display: flex;
    justify-content: flex-end;

    button {
      width: auto;
      margin-left: .5rem;
    }
  }
}

</style>

<template>
  <Modal
    :is-open="modalActivated"
    class="settings-modal"
    :class="{ peek: modalPeeked }"
    :no-background="modalPeeked"
  >
    <SettingsModalContent
      v-if="modalActivated"
      class="modal-panel"
    />
  </Modal>
</template>

<script src="./settings_modal.js"></script>

<style src="./settings_modal.scss" lang="scss"></style>

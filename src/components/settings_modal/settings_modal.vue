<template>
  <Modal
    :is-open="modalActivated"
    class="settings-modal"
    :class="{ peek: modalPeeked }"
    :no-background="modalPeeked"
  >
    <div class="settings-modal-panel panel">
      <div class="panel-heading">
        <span class="title">
          {{ $t('settings.settings') }}
        </span>
        <transition name="fade">
          <template v-if="currentSaveStateNotice">
            <div
              v-if="currentSaveStateNotice.error"
              class="alert error"
              @click.prevent
            >
              {{ $t('settings.saving_err') }}
            </div>

            <div
              v-if="!currentSaveStateNotice.error"
              class="alert transparent"
              @click.prevent
            >
              {{ $t('settings.saving_ok') }}
            </div>
          </template>
        </transition>
        <button
          class="btn"
          @click="peekModal"
        >
          {{ $t('general.peek') }}
        </button>
        <button
          class="btn"
          @click="closeModal"
        >
          {{ $t('general.close') }}
        </button>
      </div>
      <div class="panel-body">
        <SettingsModalContent v-if="modalOpenedOnce" />
      </div>
    </div>
  </Modal>
</template>

<script src="./settings_modal.js"></script>

<style src="./settings_modal.scss" lang="scss"></style>

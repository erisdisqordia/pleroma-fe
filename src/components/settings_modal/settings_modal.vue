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
          class="btn button-default"
          @click="peekModal"
          :title="$t('general.peek')"
        >
          <FAIcon
            :icon="['far', 'window-minimize']"
            fixed-width
          />
        </button>
        <button
          class="btn button-default"
          @click="closeModal"
          :title="$t('general.close')"
        >
          <FAIcon
            icon="times"
            fixed-width
          />
        </button>
      </div>
      <div class="panel-body">
        <SettingsModalContent v-if="modalOpenedOnce" />
      </div>
      <div class="panel-footer">
        <Popover
          class="export"
          trigger="click"
          placement="top"
          :offset="{ y: 5, x: 5 }"
          :bound-to="{ x: 'container' }"
          remove-padding
          >
          <button
            slot="trigger"
            class="btn button-default"
            :title="$t('general.close')"
            >
            <span>{{ $t("settings.file_export_import.backup_restore") }}</span>
            <FAIcon
              icon="chevron-down"
            />
          </button>
          <div
            slot="content"
            slot-scope="{close}"
          >
            <div class="dropdown-menu">
              <button
                class="button-default dropdown-item dropdown-item-icon"
                @click.prevent="backup"
                @click="close"
              >
                <FAIcon
                  icon="file-download"
                  fixed-width
                /><span>{{ $t("settings.file_export_import.backup_settings") }}</span>
              </button>
              <button
                class="button-default dropdown-item dropdown-item-icon"
                @click.prevent="backupWithTheme"
                @click="close"
              >
                <FAIcon
                  icon="file-download"
                  fixed-width
                /><span>{{ $t("settings.file_export_import.backup_settings_theme") }}</span>
              </button>
              <button
                class="button-default dropdown-item dropdown-item-icon"
                @click.prevent="restore"
                @click="close"
              >
                <FAIcon
                  icon="file-upload"
                  fixed-width
                /><span>{{ $t("settings.file_export_import.restore_settings") }}</span>
              </button>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  </Modal>
</template>

<script src="./settings_modal.js"></script>

<style src="./settings_modal.scss" lang="scss"></style>

<template>
<Modal
  v-if="isLoggedIn && !resettingForm"
  :is-open="modalActivated"
  class="settings-modal"
  >
  <div class="settings-modal-panel panel">
    <div class="panel-heading">
      {{ $t('settings.settings') }}
    </div>
    <div class="panel-body">
      <tab-switcher
        class="settings_tab-switcher"
        :sideTabBar="true"
        :scrollableTabs="true"
        ref="tabSwitcher"
        >
        <div :label="$t('settings.profile_tab')"><Profile /></div>
        <div :label="$t('settings.security_tab')"><Security /></div>
        <div :label="$t('settings.notifications')"><Notifications /></div>
        <div :label="$t('settings.data_import_export_tab')"><DataImportExport /></div>
        <div :label="$t('settings.mutes_and_blocks')"><MutesAndBlocks /></div>
      </tab-switcher>
    </div>
  </div>
</Modal>
</template>

<script src="./settings_modal.js"></script>

<style src="./settings_modal.scss" lang="scss"></style>

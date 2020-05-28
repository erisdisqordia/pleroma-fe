<template>
  <tab-switcher
    ref="tabSwitcher"
    class="settings_tab-switcher"
    :side-tab-bar="true"
    :scrollable-tabs="true"
  >
    <div
      :label="$t('settings.general')"
      icon="wrench"
    >
      <GeneralTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.profile_tab')"
      icon="user"
    >
      <ProfileTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.security_tab')"
      icon="lock"
    >
      <SecurityTab />
    </div>
    <div
      :label="$t('settings.filtering')"
      icon="filter"
    >
      <FilteringTab />
    </div>
    <div
      :label="$t('settings.theme')"
      icon="brush"
    >
      <ThemeTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.notifications')"
      icon="bell-ringing-o"
    >
      <NotificationsTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.data_import_export_tab')"
      icon="download"
    >
      <DataImportExportTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.mutes_and_blocks')"
      :fullHeight="true"
      icon="eye-off"
    >
      <MutesAndBlocksTab />
    </div>
    <div
      :label="$t('settings.version.title')"
      icon="info-circled"
    >
      <VersionTab />
    </div>
  </tab-switcher>
</template>

<script src="./settings_modal_content.js"></script>

<style src="./settings_modal_content.scss" lang="scss"></style>

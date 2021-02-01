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
      data-tab-name="general"
    >
      <GeneralTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.profile_tab')"
      icon="user"
      data-tab-name="profile"
    >
      <ProfileTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.security_tab')"
      icon="lock"
      data-tab-name="security"
    >
      <SecurityTab />
    </div>
    <div
      :label="$t('settings.filtering')"
      icon="filter"
      data-tab-name="filtering"
    >
      <FilteringTab />
    </div>
    <div
      :label="$t('settings.theme')"
      icon="paint-brush"
      data-tab-name="theme"
    >
      <ThemeTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.notifications')"
      icon="bell"
      data-tab-name="notifications"
    >
      <NotificationsTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.data_import_export_tab')"
      icon="download"
      data-tab-name="dataImportExport"
    >
      <DataImportExportTab />
    </div>
    <div
      v-if="isLoggedIn"
      :label="$t('settings.mutes_and_blocks')"
      :fullHeight="true"
      icon="eye-slash"
      data-tab-name="mutesAndBlocks"
    >
      <MutesAndBlocksTab />
    </div>
    <div
      :label="$t('settings.version.title')"
      icon="info"
      data-tab-name="version"
    >
      <VersionTab />
    </div>
  </tab-switcher>
</template>

<script src="./settings_modal_content.js"></script>

<style src="./settings_modal_content.scss" lang="scss"></style>

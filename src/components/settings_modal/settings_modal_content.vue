<template>
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
          icon="chat"
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
          class="full-height"
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
    </div>
  </div>
</template>

<script src="./settings_modal_content.js"></script>

<style src="./settings_modal_content.scss" lang="scss"></style>

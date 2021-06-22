<template>
  <div
    id="app"
    :style="bgStyle"
  >
    <div
      id="app_bg_wrapper"
      class="app-bg-wrapper"
    />
    <MobileNav v-if="isMobileLayout" />
    <DesktopNav v-else />
    <div class="app-bg-wrapper app-container-wrapper" />
    <div
      id="content"
      :style="thirdColumnLayout"
      class="container"
    >
      <div
        class="sidebar-flexer mobile-hidden"
        :style="sidebarAlign"
      >
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <user-panel />
              <div v-if="!isMobileLayout">
                <nav-panel />
                <instance-specific-panel v-if="showInstanceSpecificPanel" />
                <features-panel v-if="!currentUser && showFeaturesPanel" />
                <who-to-follow-panel v-if="currentUser && suggestionsEnabled" />
                <notifications v-if="currentUser && !thirdColumnEnabled" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="main"
      >
        <div
          v-if="!currentUser"
          class="login-hint panel panel-default"
        >
          <router-link
            :to="{ name: 'login' }"
            class="panel-body"
          >
            {{ $t("login.hint") }}
          </router-link>
        </div>
        <router-view />
      </div>
      <div
        v-if="thirdColumnEnabled"
        class="sidebar-flexer mobile-hidden"
        :style="notifsAlign"
      >
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <div v-if="!isMobileLayout">
                <notifications v-if="currentUser" />
                <features-panel v-if="!currentUser && showFeaturesPanel" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <media-modal />
    </div>
    <chat-panel
      v-if="currentUser"
      :floating="true"
      class="floating-chat mobile-hidden"
      :class="{ 'left': shoutboxPosition }"
    />
    <MobilePostStatusButton />
    <UserReportingModal />
    <PostStatusModal />
    <SettingsModal />
    <portal-target name="modal" />
    <GlobalNoticeList />
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>

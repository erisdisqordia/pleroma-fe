<template>
  <div class="user-panel">
    <div v-if='user' class="panel panel-default" style="overflow: visible;">
      <user-card-content :user="user" :switcher="false" :hideBio="true"></user-card-content>
      <div class="panel-footer">
        <post-status-form v-if='user'></post-status-form>
      </div>
    </div>
    <login-form v-if='!user'></login-form>
  </div>
</template>

<script src="./user_panel.js"></script>

<style lang="scss">
.user-panel {
  .profile-panel-background .panel-heading {
    background: transparent;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

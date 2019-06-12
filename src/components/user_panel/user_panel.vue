<template>
  <div class="user-panel">

    <div v-if="signedIn" key="user-panel" class="panel panel-default signed-in">
      <UserCard :user="user" :hideBio="true" rounded="top"/>
      <div class="panel-footer">
        <post-status-form v-if='user'></post-status-form>
      </div>
    </div>
    <auth-form v-else key="user-panel"/>
  </div>
</template>

<script src="./user_panel.js"></script>

<style lang="scss">
.user-panel .signed-in {
  overflow: visible;
}
</style>

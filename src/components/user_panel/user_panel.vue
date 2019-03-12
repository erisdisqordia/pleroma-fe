<template>
  <div class="user-panel">
    <div v-if='user' class="panel panel-default" style="overflow: visible;">
      <UserCard :user="user" :hideBio="true" rounded="top"/>
      <div class="panel-footer">
        <post-status-form v-if='user'></post-status-form>
      </div>
    </div>
    <login-form v-if='!user'></login-form>
  </div>
</template>

<script src="./user_panel.js"></script>

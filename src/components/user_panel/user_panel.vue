<template>
  <div class="user-panel">
    <div v-if='user' class="panel panel-default">

      <user-card-content :user="user"></user-card-content>

      <div class="panel-footer">
        <post-status-form v-if='user'></post-status-form>
      </div>
    </div>
    <login-form v-if='!user'></login-form>
  </div>
</template>

<script src="./user_panel.js"></script>

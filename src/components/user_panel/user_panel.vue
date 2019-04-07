<template>
  <div class="user-panel">
    <div
      v-if="user"
      class="panel panel-default"
      style="overflow: visible;"
    >
      <UserCard
        :user="user"
        :hide-bio="true"
        rounded="top"
      />
      <div class="panel-footer">
        <post-status-form v-if="user" />
      </div>
    </div>
    <login-form v-if="!user" />
  </div>
</template>

<script src="./user_panel.js"></script>

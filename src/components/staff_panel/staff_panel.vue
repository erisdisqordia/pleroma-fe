<template>
  <div class="staff-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background">
        <div class="title">
          {{ $t("about.staff") }}
        </div>
      </div>
      <div class="panel-body">
        <basic-user-card
          v-for="user in staffAccounts"
          :key="user.screen_name"
          :user="user"
        />
      </div>
    </div>
  </div>
</template>

<script src="./staff_panel.js" ></script>

<style lang="scss">
</style>
